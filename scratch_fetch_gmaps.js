async function test() {
  const res = await fetch('https://maps.app.goo.gl/yaPUQR26M6jbg49F9', {
    redirect: 'follow',
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
  });
  console.log('Final URL:', res.url);
  const text = await res.text();
  const title = text.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:', title ? title[1] : 'none');

  // Look for any image urls like lh3.googleusercontent.com/p/...
  const contentRegex = /https:\/\/lh[0-9]\.googleusercontent\.com\/p\/[a-zA-Z0-9_\-]+/gi;
  const userPhotos = [...new Set(text.match(contentRegex) || [])];
  console.log('User uploaded photos count:', userPhotos.length);
  userPhotos.forEach(p => console.log('Photo URL:', p));

  // Look for reviews / ratings / address
  const phoneMatch = text.match(/\+91[\s\-]?[0-9]{5}[\s\-]?[0-9]{5}/g);
  console.log('Phones found:', phoneMatch);

  const addressMatch = text.match(/"([^"]{10,120}(?:Gujarat|Surat|Jolva|Palsana|Kadodara)[^"]*)"/gi);
  console.log('Address candidate strings:', addressMatch?.slice(0, 10));
}

test();
