## **Group 26**
Group members:
  * Simon Nordvold Barak          |  simonnb
  * Jinwei Pan                    |  jinweip
  * Irfanullah Nazand             |  irfanuln
# Commodity Dispensing

This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).

## **Prerequsites**

_DHIS2 CLI installed_

_DHIS2 Portal installed_

## **First time setup**

Use yarn install command in the project directory to import all the dependencies:

```bash
$ yarn install
```

then run the DHIS2 portal proxy with:

```bash
$ npx dhis-portal --target=https://data.research.dhis2.org/in5320/
```

Lastly, run the yarn start command in the project directory:

```bash
$ yarn start
```

## **About app:**
This project is the result of our work in course IN5320. The application is built on the dhis2 platform and leverages some of its available design components. The application consists of the following available components:
#### **Overview** ####
Allows users to view the stock balance of different commodities in the hospital store system. Users can also search for items, filter out different categories, and sort by the inventory balance in each category.

#### **Dispensing** ####
Allows the user to assign different items in the inventory. The user must enter an item and amount, as well as dispenser and recipient names. All of these fields are required to successfully submit the form. Upon success, the solution commits the information to the data store for recording and updates the inventory in the overview.

#### **Restock** ####


#### **Management** ####

## **Suggested/not-yet-realized future additions/weaknesses:**

