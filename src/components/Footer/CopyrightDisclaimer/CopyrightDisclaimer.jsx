import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function CopyrightDisclaimer() {
  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 cursor-default">
          © 2025 GameStart™. Projet à but éducatif. Réalisé par{" "}
          <span className="font-bold text-rosy">Yassine Baadi</span>
        </span>
        <div className="flex mt-4 sm:justify-center sm:mt-0 gap-2">
          <Link href={"https://github.com/YassineBaadi"} target="_blank">
            <span className="text-gray-500 hover:text-gray-900 dark:hover:text-rosy ms-5 text-2xl">
              <FontAwesomeIcon icon={faGithub} />
            </span>
          </Link>
          <Link
            href="#"
            target="_blank">
            <span className="text-gray-500 hover:text-gray-900 dark:hover:text-rosy ms-5 text-2xl">
              <FontAwesomeIcon icon={faLinkedin} />
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
