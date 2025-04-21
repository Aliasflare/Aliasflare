# API
## Auth
- [X] Database: Session Table
- [X] Database: Session Types
- [X] API: /api/auth/login
- [X] API: /api/auth/logout
- [ ] API: /api/auth/resetPassword
- [ ] API: /api/auth/signup (alias for /api/users/create if enabled)

## Users
- [X] Database: User Table
- [X] Database: User Types
- [X] API: /api/users/create
- [X] API: /api/users/get
- [X] API: /api/users/list
- [ ] API: /api/users/update
- [ ] API: /api/users/delete
- [ ] Feature: Mail and alias quota

## Aliases
- [X] Database: Alias Table
- [X] Database: Alias Types
- [X] API: /api/alias/create
- [X] API: /api/alias/get
- [X] API: /api/alias/list (by user)
- [ ] API: /api/alias/update
- [ ] API: /api/alias/delete
- [ ] API: /api/alias/sendWithAlias
- [X] Feature: Allow overwriting own/sender name
- [ ] Feature: Auto-delete after time
- [X] Feature: Multi-domain (store domain too)

## Reverse-Aliases
- [X] Database: ReverseAlias Table
- [X] Database: ReverseAlias Types
- [ ] API: /api/reverseAlias/create (really needed?)
- [ ] API: /api/reverseAlias/list (by alias)
- [ ] API: /api/reverseAlias/update
- [ ] API: /api/reverseAlias/delete
- [X] Feature: Multi-domain (store domain too)

## TempMails (short living aliases)
- [ ] Database: TempMail Table
- [ ] Database: TempMail Types
- [ ] API: /api/tempMail/create
- [ ] API: /api/tempMail/list (by user)

## Reserved Addresses
- [X] Database: ReservedAddress Table
- [X] Database: ReservedAddress Types
- [X] Feature: Respeect when generating Alias IDs
- [X] Feature: Multi-domain (store domain too)

# Web
## Logic
- [ ] Auth Handler
- [ ] API Client

## Pages
- [ ] /auth/login
- [ ] /auth/signup
- [ ] /user/overview
- [ ] /user/aliases
- [ ] /user/account
- [ ] /admin/users
- [ ] /admin/aliases