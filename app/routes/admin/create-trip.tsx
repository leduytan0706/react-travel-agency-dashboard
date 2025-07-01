import { Header } from 'components'
import React, { useState } from 'react'
import {ComboBoxComponent} from "@syncfusion/ej2-react-dropdowns";
import type { Route } from './+types/create-trip';
import { comboBoxItems, selectItems, selectPlaceholders } from '~/constants';
import { cn, formatKey } from '~/lib/utils';
import { LayerDirective, LayersDirective, MapsComponent } from '@syncfusion/ej2-react-maps';
import { world_map } from '~/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '~/appwrite/client';
import { useNavigate } from 'react-router';

// get countries from a public api
export const loader = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=flag,name,latlng,maps");
    const data = await response.json();
    

    // console.log(data);
    // map into an array of necessary attributes
    return data.map((country: any) => ({
        name: country.flag + "  " + country.name.common,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMap
    }));
};

const CreateTrip = ({loaderData}: Route.ComponentProps) => {
    // parse into array of type Country
    const countries = loaderData as Country[];
    console.log(countries);
    const navigate = useNavigate();

    // convert countries data into a format suitable for combo box
    const countryData = countries.map((country: any) => ({
        text: country.name,
        value: country.value
    }));

    // create state for form data type TripFormData
    const [formData, setFormData] = useState<TripFormData>({
        country: countries[0]?.name || "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: 0,
        groupType: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData({
            ...formData,
            [key]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (
            !formData.country ||
            !formData.travelStyle ||
            !formData.interest || 
            !formData.budget ||
            !formData.groupType
        ) {
            setError("Please fill in values for all fields.");
            setLoading(false);
            return;
        }

        if (formData.duration < 1 || formData.duration > 10){
            setError("Travel duration must be between 1 and 10 days.");
            setLoading(false);
            return;
        }

        const user = await account.get();
        if (!user.$id){
            console.error('User not authenticated.');
            setLoading(false);
            return;
        }

        try {
            console.log('user',user);
            console.log('trip', formData);
            const {country, duration, groupType, travelStyle, interest, budget} = formData;

            // create new trip
            const response = await fetch("/api/create-trip",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({
                    country,
                    duration,
                    groupType,
                    travelStyle,
                    interest,
                    budget,
                    userId: user.$id
                })
            });

            const data: CreateTripResponse = await response.json();
            if (data?.id){
                navigate(`/trips/${data.id}`);
            }
            else throw new Error("Failed to create AI generated trip.");
        } catch (error) {
            console.error("Error generating new trip:",error);
        } finally{
            setLoading(false);
        }

    };

    

    
    // array containing the selected countries on the map
    const mapData = [
        {
            country: formData.country,
            color: "#EA382E",
            // get the coordinates
            coordinates: countries.find((country: Country) => country.name === formData.country)?.coordinates || []
        }
    ]

  return (
    <main className='flex flex-col gap-10 pb-20 wrapper'>
        <Header 
            title="Add a New Trip"
            description='View and edit AI-generated travel plans'
        />

        <section className='mt-2.5 wrapper-md'>
            <form action="" className='trip-form' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="country">
                        Country 
                    </label>
                    <ComboBoxComponent
                        id='country'
                        dataSource={countryData}
                        fields={{text: 'text', value: 'value'}}
                        placeholder='Select a country'
                        className='combo-box'
                        // handle value change
                        change={(e: {value: string | undefined}) => {
                            if (e.value){
                                handleChange('country', e.value);
                            }
                        }}
                        allowFiltering
                        // modify filtering, filter the countries with the name contains the query input
                        filtering={(e) => {
                            const query = e.text.toLowerCase();

                            e.updateData(
                                countries
                                    .filter((country: Country) => country.name.toLowerCase().includes(query))
                                    .map(((country: Country) => ({
                                        text: country.name,
                                        value: country.value
                                    })))
                            );
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="duration">
                        Duration
                    </label>
                    <input 
                        id='duration'
                        name='duration'
                        placeholder='Enter a number of days'
                        className='form-input placeholder:text-gray-100'
                        onChange={(e) => handleChange('duration', Number(e.target.value))}
                    />
                </div>

                {selectItems.map((key: keyof TripFormData) => (
                    <div key={key}>
                        <label htmlFor={key}>
                            {/* format key: separate with space, capitalize, ... */}
                            {formatKey(key)}
                        </label>

                        <ComboBoxComponent 
                            id={key}
                            dataSource={comboBoxItems[key].map((item) => ({
                                text: item,
                                value: item
                            }))}
                            placeholder={selectPlaceholders[key]}
                            fields={{text: 'text', value: 'value'}}
                            change={(e: {value: string | undefined}) => {
                                if (e.value){
                                    handleChange(key, e.value);
                                }
                            }}
                            allowFiltering
                            // modify filtering, filter the countries with the name contains the query input
                            filtering={(e) => {
                                const query = e.text.toLowerCase();

                                e.updateData(
                                    comboBoxItems[key]
                                        .filter((item: string) => item.toLowerCase().includes(query))
                                        .map(((item: string) => ({
                                            text: item,
                                            value: item
                                        })))
                                );
                            }}
                            className='combo-box'  
                        />
                    </div>
                ))}

                <div>
                    <label htmlFor="location">
                        Location on the world map
                    </label>

                    <MapsComponent>
                        <LayersDirective>
                            <LayerDirective 
                                shapeData={world_map}
                                dataSource={mapData}
                                shapePropertyPath='name'
                                shapeDataPath='country'
                                shapeSettings={{
                                    colorValuePath: 'color',
                                    fill: '#e5e5e5'
                                }}
                            />
                        </LayersDirective>
                    </MapsComponent>
                </div>

                <div className='bg-gray-200 h-px w-full' />

                {error && (
                    <div className='error'>
                        <p>{error}</p>
                    </div>
                )}

                <footer className='px-6 w-full'>
                    <ButtonComponent
                        type='submit'
                        className='button-class !h-12 !w-full'
                        disabled={loading}
                    >
                        <img 
                            src={`/assets/icons/${loading? "loader.svg": "magic-star.svg"}`} 
                            alt="submit icon" 
                            className={cn('size-5', {'animate-spin': loading})}
                        />
                        <span className='p-16-semibold text-white'>{loading? "Generating ...": "Generate new trip"}</span>
                    </ButtonComponent>
                </footer>
            </form>
        </section>
    </main>
  )
}

export default CreateTrip