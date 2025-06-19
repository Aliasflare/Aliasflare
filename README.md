<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./public/logo_dark.png">
  <source media="(prefers-color-scheme: light)" srcset="./public/logo.png">
  <img alt="Fallback image description" src="./public/logo_dark.png" width=400>
</picture>
</p>

AliasFlare is a lightweight, Cloudflare-based email aliasing service that lets you create unlimited aliases to forward incoming and outgoing emails to your real inbox. It supports full reverse-aliasing, so you can send replies from your alias addresses while keeping your personal email private.

> [!WARNING]  
> This project is currently in it's early stages, there might be breaking changes for Database Structure!  
> Always check the commits for possible breaking changes with regards to Database Structure!

## ✨ Features
- Unlimited Aliases: Create as many email aliases as you need without any restrictions.
- Seamless Forwarding: Effortlessly forward both incoming and outgoing emails to and from your real inbox.
- Reverse-Aliasing: Reply from your alias address, maintaining privacy without revealing your personal email.
- Cloudflare Powered: Enjoy fast and reliable email routing through Cloudflare's secure and scalable infrastructure.
- Privacy Focused: Protect your personal inbox from spam and unwanted exposure while keeping your communication streamlined.
- Easy to Use: Simple setup with no complex configurations, making email management effortless and secure.

## 🛠 Configurtion
### 1. Setup Cloudflare Account
1. Create a Cloudflare Account at [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Register your desired Domain at Cloudflare `(Account Home->Domains->Add a domain)`
3. Create an API Token `(Account->API Token->Create Token)`  
  3.1 Select `Edit Cloudflare Workers` template from `API token templates`  
  3.2 Change `Token name` to `Aliasflare`  
  3.3 Add permission `(Zone, Email Routing Rules, Edit)` (needed for binding the worker to incoming mails)   
  3.4 Add permission `(Zone, Zone Settings, Edit)` (needed for enabling email routing)  
  3.5 Add permission `(Account, D1, Edit)` (needed for creating the database)  
  3.6 Add permission `(Account, Email Routing Addresses, Edit)` (needed for destinations)  
  3.7 Select your account under `Account Resources` `(Include, YOUR ACCOUNT)`  
  3.8 Select your domain under `Zone Resources` `(Include, Specific zone, YOUR DOMAIN)`  
  3.9 Click on `Continue to summary` and then on `Create Token`  
  3.10 NOTE DOWN YOU TOKEN SECURELY! YOU WILL NEED IT LATER AND CANNOT VIEW IT IF THE TAB IS CLOSED!

### 2. Setup GitHub Repository
1. Fork this repository into your GitHub Account
2. Goto `Settings->Secrets and variables`
3. Select `Secrets` and add the following secrets  
  3.1 Add `CLOUDFLARE_API_TOKEN` with your before generated API Token  
  3.2 (OPTIONAL) Add `MAILGUN_API_KEY` if you setup your domain at mailgun for outgoing mails
4. Select `Variables` and add the following variables  
  4.1 Add `CLOUDFLARE_DOMAINS` containing your domains in a comma-seperated list  
  4.2 (OPTIONAL) Add `CLOUDFLARE_WORKER_NAME` if you want to use another Cloudflare Worker  
  4.3 (OPTIONAL) Add `CLOUDFLARE_DATABASE_NAME` if you want to use another Cloudflare D1 Database

### 3. Deploy (look at "Deployment & Upgrades")

### 4. Create your first user account
1. Navigate to one of your desired domains
2. Login using `admin` and `AliasflareAdmin1234`
3. Goto `Settings` and change your password
4. Select `Admin Mode` and goto `Users`
5. Create your actual user by clicking the `(+)` in the Users table

## 📦 Deployment & Updates

For initial deployment or after an update you have to redeploy your app and upgrade the database!

### Deploying
1. Goto `Actions`
2. Select `Deploy` at the left  
  2.1 Click on `Run workflow` and `Run workflow` again

### Updating
1. Goto `Actions`
2. Select `Update` at the left  
  2.1 Click on `Run workflow` and `Run workflow` again