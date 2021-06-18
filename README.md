# ReputeAid
A web extension that helps users avoid irreputable sites. When they are on a domain that is not trustworthy, the extension offers a list of safe sites that have similar topics available.

How it works:
  1. The extension will look at the url, thus obtaining the domain and keywords
  (which are all words following the extension)
  2. The extension will check whether or not the domain is in the trusted
  sites list
  3. If the domain is in the list, then the extension will display that the site
  is trustworthy, and will offer an alternative.
  4. If the domain is not in the list, then the extension will display that
  the site is not trustworthy, and will offer alternatives from trusted sites.
  5. alternative links are found by searching google with the keywords and
  checking the first 10 links. If the domain of a link is in the safe list,
  the alternative is added to the extension's display.

  The plan is to later parse the webpage using python to create a better
  keyword list. Once that is done, the bullet points will be updated.
