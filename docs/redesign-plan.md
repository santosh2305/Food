# Homepage refresh and approved payment rollout

Build on the working storefront, preserving existing menu IDs, cart and manual merchant verification. Replace the restrained serif-led homepage with bold self-hosted sans typography, saturated green/orange, bigger food imagery and distinct ordering paths for everyday meals, daily protein and monthly salads. Keep all pages responsive and keyboard accessible.

Copy the approved merchant QR byte-for-byte to public assets. Configure the public asset path through the existing build environment, never reproduce payment destination details in logs or code. Keep automated settlement claims disabled. Verify the asset loads and its digest matches the approved file without printing payment information or capturing QR screenshots.

Monthly1.jpeg: advertised 20 bowls, ₹2,750 less ₹150 = ₹2,600/month; free packing and delivery; eight visible entries across the two alternating-week panels. Publish supplied weekdays, dressings and individual listed prices exactly. Explain that the complete rotation, start date and remaining bowls are confirmed with the kitchen before subscription payment. No invented dates or recurring billing.

Monthly2.jpeg: seven daily protein dishes with prices ₹150, ₹150, ₹155, ₹180, ₹185, ₹250 and ₹300. Add them to the regular catalogue, retain the existing ₹300 minimum, and label monthly protein arrangements as enquiries because no monthly protein price was provided.

Validate data, checkout safety, mobile/desktop layout and accessibility. Commit the refresh branch, deploy via GitHub Actions, and verify the site in a fresh browser context with no cookies or login. The public URL should remain unchanged.
