import { ButtonComponent } from '@syncfusion/ej2-react-buttons'
import React from 'react'
import { Link, redirect } from 'react-router'
import { loginWithGoogle } from '~/appwrite/auth';
import { account } from '~/appwrite/client';

// loader that runs data fetching asynchronously before the component renders
export async function clientLoader() {
    try {
        const user = await account.get();
        if (user.$id) return redirect("/");
    } catch (error) {
        console.log("Error fetching user:",error);
    }
};

const SignIn = () => {
  return (
    <main className='auth'>
        <section className='size-full glassmorphism flex-center px-6'>
            <div className='sign-in-card'>
                <header className='header'>
                    <Link to="/">
                        <img 
                            src="/assets/icons/logo.svg" 
                            alt="logo" 
                            className='size-[30px]'
                        />
                    </Link>
                    <h1 className='p-28-bold'>Travelpal</h1>
                </header>

                <article className=''>
                    <h2 className='p-28-semibold text-center text-dark-100'>Start Your Travel Journey</h2>
                    <p className='p-18-regular text-center text-gray-100 !leading-7'>Sign in with Google to manage destinations, intineraries and user activities with ease.</p>
                </article>

                <ButtonComponent
                    type='button'
                    iconCss='e-search-icon'
                    className='button-class !h-11 !w-full'
                    onClick={loginWithGoogle}
                >
                    <img 
                        src="/assets/icons/google.svg" 
                        alt="google icon" 
                        className='size-5'
                    />
                    <span className='text-white p-18-semibold'>Sign in with Google</span>
                </ButtonComponent>
            </div>
        </section>
    </main>
  )
}

export default SignIn