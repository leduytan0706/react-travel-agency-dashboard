import React from 'react'
import { Outlet } from 'react-router'
import {SidebarComponent} from "@syncfusion/ej2-react-navigations";
import { MobileSidebar, NavItems } from 'components';

const AdminLayout = () => {
  return (
    <div className='admin-layout'>
        <MobileSidebar />
        {/* sidebar */}
        <aside className='w-full max-w-[270px] hidden lg:block'>
            <SidebarComponent width={270} enableGestures={false} >
              <NavItems />
            </SidebarComponent>
        </aside>

        {/* renders the matching child route of a parent route or nothing if no child matches */}
        <aside className='children'>
            <Outlet />
        </aside>
    </div>
  )
}

export default AdminLayout