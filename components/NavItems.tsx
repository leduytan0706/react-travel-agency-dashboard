import { Link, NavLink } from "react-router"
import { sidebarItems } from "~/constants"
import { cn } from "~/lib/utils"


const NavItems = ({handleClick}: {handleClick?: () => void}) => {
  const user = {
    name: "Phat",
    email: "tnf0706@example.com",
    imageUrl: "/assets/images/david.webp"
  }

  return (
    <section className="nav-items">
        <Link to='/' className="link-logo">
            <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
            <h1>Travelpal</h1>
        </Link>

        <div className="container">
          <nav className="flex flex-col justify-start">
            {sidebarItems.map(({id, href, icon, label})=> (
              <NavLink to={href} key={id} className="h-fit p-0 w-full">
                {({isActive}:{isActive: boolean}) => (
                  <div className={cn('group nav-item',{
                    'bg-primary-100 !text-white': isActive
                  })}
                    onClick={handleClick}
                  >
                    <img 
                      src={icon}
                      alt={label}
                      className={`group-hover:brightness-0 size-5 group-hover:invert ${isActive? "brightness-0 invert": "text-dark-200"}`}
                    />
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          <footer className="nav-footer">
            <img 
              src={user?.imageUrl || '/assets/images/david.webp'} 
              alt={`${user?.name || 'David'} avatar`} 
            />
            <article>
              <h2 className="">{user?.name}</h2>
              <p className="">{user?.email}</p>
            </article>

            <button
              className="cursor-pointer"
              onClick={() => {
                console.log("logging out");
              }}
            >
              <img
                src="/assets/icons/logout.svg"
                alt="logout"
                className="size-6"
              />
            </button>
          </footer>
        </div>
    </section>
  )
}

export default NavItems