### Usage Example:

`npm i arekom/scrapedin`

```javascript
const scrapedin = require('scrapedin');

const profileScraper = await scrapedin({ email: 'login@mail.com', password: 'pass' });
const profile = await profileScraper('https://www.linkedin.com/in/some-profile/');
```

### Start Guide:

- [Basic Tutorial](https://github.com/linkedtales/scrapedin/wiki/Basic-Tutorial)
- [Using Cookies to Login](https://github.com/linkedtales/scrapedin/wiki/Using-Cookies-To-Login)
- [Tips](https://github.com/linkedtales/scrapedin/wiki/Tips)
- [Documentation](https://github.com/linkedtales/scrapedin/wiki/Documentation)
