# Sherwood Partners — Static Site Files

Full static export of sherwoodpartners.com, ready to upload to Hostinger.

## To deploy
Upload everything in this repo (except this README and `.git`) to the
web root on Hostinger. Standard static HTML/CSS/JS — no build step, no
server-side dependencies required.

## Note on the contact form
The form on `/contact/` currently posts to `/api/contact`, an endpoint
that isn't included here — it was running on infrastructure tied to the
site's prior hosting. Once live on Hostinger, you'll want to either:
- Wire up your own form handler (e.g. PHP mail, or an SMTP/API service), or
- Swap it for a HubSpot embedded form

Either is fine — just flagging so it doesn't go quietly non-functional
after the move.
