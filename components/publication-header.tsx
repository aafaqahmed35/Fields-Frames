import Link from "next/link";

const navigation = [
  { href: "/football", label: "Football" },
  { href: "/films", label: "Films" },
  { href: "/journal", label: "Journal" },
];

export function PublicationHeader() {
  return (
    <header className="publication-header">
      <div className="publication-header__inner">
        <Link className="masthead" href="/" aria-label="Field and Frames, home">
          Field<span aria-hidden="true">&amp;</span>Frames
        </Link>

        <nav className="primary-navigation" aria-label="Primary navigation">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
