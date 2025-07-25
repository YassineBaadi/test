import Link from "next/link";

function FooterNavLinksComponent({ section_name, links }) {
  return (
    <div className="transition-all duration-100 translate-y-8 hover:scale-103 hover:shadow-lg rounded-lg mb-2">
      <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white cursor-default">
        {section_name}
      </h2>
      <ul className="text-ivory font-medium">
        {links.map((link) => (
          <li key={link.name} className="mb-4">
            <Link href={link.url} className="inline-block group">
              <p className="relative inline-block after:content-[''] after:block after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-rosy after:w-0 after:transition-all after:duration-300 group-hover:after:w-full text-gray-300">
                {link.name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FooterNavLinks({ links }) {
  return (
    <>
      {links.map((section) => (
        <FooterNavLinksComponent
          key={section.title}
          section_name={section.title}
          links={section.links}
        />
      ))}
    </>
  );
}
