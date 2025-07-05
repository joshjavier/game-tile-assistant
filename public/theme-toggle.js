(function () {
  const getColorScheme = (storageKey = 'mantine-color-scheme-value') => {
    if (localStorage.getItem(storageKey)) {
      return localStorage.getItem(storageKey);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  document.documentElement.setAttribute('data-mantine-color-scheme', getColorScheme());
})();
