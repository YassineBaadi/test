import Link from "next/link";

export function NavbarNavLinksComponent({ name, url, toggleMenu }) {
  return (
    <Link
      href={url}
      key={name}
      onClick={toggleMenu}
      className="text-slate-300 hover:text-pine hover:bg-midnight lg:px-3 px-2 py-2 rounded-md text-sm font-medium transition-all duration-200">
      {name}
    </Link>
  );
}
export function NavbarNavLinks({ links, toggleMenu }) {
  // Security check to avoid errors if links is undefined
  if (!links || !Array.isArray(links)) {
    return null;
  }

  return (
    <>
      {links.map((link) => (
        <NavbarNavLinksComponent
          key={link.name}
          name={link.name}
          url={link.url}
          toggleMenu={toggleMenu}
        />
      ))}
    </>
  );
}
