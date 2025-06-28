//@ts-nocheck

import { Sidebar, SidebarComponent } from '@syncfusion/ej2-react-navigations'
import React from 'react'
import { Link } from 'react-router'
import NavItems from './NavItems';

const MobileSidebar = () => {
    let sidebar: SidebarComponent;

    const toggleSidebar = () => {
        sidebar.toggle();
    };

  return (
    <div className='mobile-sidebar wrapper'>
        <header className=''>
            <Link
                to="/"
            >
                <img src="/assets/icons/logo.svg" alt="logo" className='size-[30px]' />
                <h1>Travelpal</h1>
            </Link>

            {/* //@ts-ignore */}
            <button 
                onClick={toggleSidebar}
                className='cursor-pointer'

            >
                <img src="/assets/icons/menu.svg" alt="menu" className='size-7'/>
            </button>

            {/* Use SidebarComponent from Syncfusion to make a mobile sliding sidebar menu */}
            {/* //@ts-ignore */}
            <SidebarComponent 
                width={270}
                ref={(Sidebar) => sidebar = Sidebar}
                // close first
                created={() => sidebar.hide()}
                // close when outer is clicked
                closeOnDocumentClick={true}
                showBackdrop={true}
                type='over'
            >
                {/* passing in NavItems so it can render in similar styles */}
                <NavItems handleClick={toggleSidebar}/>
            </SidebarComponent>
        </header>
    </div>
  )
}

export default MobileSidebar