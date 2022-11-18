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
Allows users to view the stock balance of different commodities in the hospital store system. Users can also search for items, filter out different categories, and sort by the inventory balance in each category. We added  a simple way for the user to change the month to view older data. It is locked in the year of 2021 because that is where the dataset contains data. It does not currently support searching by name and categories both in a completely correct way. We wanted the user to be able to organize their data quickly and however they wanted.

#### **Dispensing** ####
Allows the user to assign different items in the inventory. The user must enter an item and amount, as well as dispenser and recipient names. All of these fields are required to successfully submit the form. Upon success, the solution commits the information to the data store for recording and updates the inventory in the overview. We designed it this way because the user(store manager) was interpreted as a person who collects these dispensing forms and fills out the system. Requiring the access to local users. We assume the recipients of dispensing are also in the system and have a dynamically generated dropbox of all users in proximity of the logged in user. Not just within the same organization as with the Dispenser. We wanted to keep our design simple and not present too many options all at once, hence the setup of limiting/disabling buttons until the data is there. This is because in the project text it was said that not all users were as technically proficient as was normally required.

#### **Recount** ####

Allows the user to input in an easy to manage way for multiple inputs. It validates by checking if the input is exiting and only adds values that are filled out. Our approach was in line with an inventory management way of thinking. You want to be able to see all wares and open to input very simply into all of them. It makes it much easier to do bulk recounts. It was why we did not choose to use a single commodity to update/ add to a list to update. 

#### **Management** ####
This allows the user to update the value of quantity to be ordered. It is very similar in approach to Recount and holds the same values for when designing it. We wanted to do more for the report for this and actually show dynamically how much the end balance stock would be updated before confirming the update, but we did not have time.

## **Suggested/not-yet-realized future additions/weaknesses:**
We wanted to add more dynamic validations and the feedback on these validation. Giving warning/error/correct flags for inputs and adding a more comprehensive summary for the Modal reports before submitting. The thought was to behave in a very cashier/cash machine way. Simple and with any changes noted what was happening. This is especially true for Recount and Management. We limit these two submit actions to always include a report / note on changes. An added feature to this would be nothing specifically if a recount showed up as something else than was already accounted for. We are missing notification boxes for when a  user submitted successfully and got to see immediately that their action was complete. We did not have enough time to add sorting to the other tables by column, only on overview. We have added a very simple transaction tracker to the datastore for dispensing transactions, but did not have enough time to add this for the other components. This also includes a lack of components to view such recorded transactions.
One major flaw is the lack of specific date period submission, the date only affects the overview component in showing data. All others are using the same period 202101

We managed to use the specified lint on the OverView component.
