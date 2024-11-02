function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#008ECC] dark:bg-gray-900 ">
      <div className="container px-6 py-8 mx-auto">
        <div className="flex flex-col items-center text-center ">
          <a href="#/">
            <img
              className="w-auto h-7"
              src="https://merakiui.com/images/full-logo.svg"
              alt="Company Logo"
            />
          </a>

          <div className="flex flex-wrap justify-center mt-6 -mx-4 ">
            <a
              href="#"
              className="mx-4 text-white text-sm  transition-colors duration-300 hover:text-black dark:text-gray-300 dark:hover:text-blue-400"
              aria-label="Home"
            >
              Home
            </a>
            <a
              href="#"
              className="mx-4 text-white text-sm  transition-colors duration-300 hover:text-black dark:text-gray-300 dark:hover:text-blue-400"
              aria-label="About"
            >
              About
            </a>
            <a
              href="#"
              className="mx-4 text-sm text-white transition-colors duration-300 hover:text-black dark:text-gray-300 dark:hover:text-blue-400"
              aria-label="Teams"
            >
              Teams
            </a>
            <a
              href="#"
              className="mx-4 text-sm text-white transition-colors duration-300 hover:text-black dark:text-gray-300 dark:hover:text-blue-400"
              aria-label="Privacy"
            >
              Privacy
            </a>
            <a
              href="#"
              className="mx-4 text-sm text-white transition-colors duration-300 hover:text-black dark:text-gray-300 dark:hover:text-blue-400"
              aria-label="Cookies"
            >
              Cookies
            </a>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-10 dark:border-gray-700" />

        <div className="flex flex-col items-center sm:flex-row sm:justify-between">
          <p className="text-sm text-white dark:text-gray-300">
            © Copyright {currentYear}. All Rights Reserved.
          </p>

         
        </div>
      </div>
    </footer>
  );
}

export default Footer;
