# BookBank

This website allows users to donate and receive university textbooks for free.
Our goal is to ensure that students get the textbooks that they need, and no textbooks go unwasted.

## Installation

### Prerequisites
Make sure you have the following installed:
- **Git**: You can download it from [here](https://git-scm.com/).
- **Node.js and npm**: You can download both from [here](https://nodejs.org/).

### Clone the repo
Run `git clone https://github.com/okay-cam/BookBank` in your terminal to retrieve the project.

### Install dependencies
In the root folder, run `npm i` to install all the required dependencies.

### Setting up .env
Create a .env file in the root directory of your project.

The .env must be set up with the appropriate data. This includes information such as API Keys, authentication information and ports. Ensure that these are typed in with the correct formatting with correct capitalisation and no spaces. For example:
```
VITE_API_KEY=key-information-goes-here
VITE_AUTH_DOMAIN=domain-information-goes-here
VITE_PROJECT_ID=project-id-goes-here
```
Note that not all the .env variables are mentioned here.

### Run locally
Running `npm start` will start both the frontend and backend.
The webpage can then be accessed through the localhost page at `localhost:FRONTEND-PORT-NUMBER`; a link in the console log will be accessible with the correct port number.


## Usage / Main Features

### Sign up
Use the **signup page** to make a new account. Provide an email, display name and password. This will allow the user to access the features of the website.

### Receive donations
Listings can be found on the home page or through the search bar. To get in contact to receive a listing, you can open a listing and click the **Request/Enquire** button. This will send an email to the textbook donator, allowing them to get in contact with you to arrange a donation.

### Donate textbooks
In the navigation bar, press **Create a listing** to submit a textbook for donation. You must enter information such as the textbook title, author, course code and description. Once submitting, this textbook will be available for people to make enquiries.


## Contribution

<a href="https://github.com/okay-cam"><img src="https://avatars.githubusercontent.com/u/120371810?v=4" title="Cam" width="70" height="70"></a>
<a href="https://github.com/RoryTravis"><img src="https://avatars.githubusercontent.com/u/151791418?v=4" title="Rory" width="70" height="70"></a>
<a href="https://github.com/AnnekeMuirAUT"><img src="https://avatars.githubusercontent.com/u/169871887?v=4" title="Anneke" width="70" height="70"></a>
<a href="https://github.com/JonathanAUTUni"><img src="https://avatars.githubusercontent.com/u/171815357?v=4" title="Jonathan" width="70" height="70"></a>


## License
This project is free to use under the MIT License.
See the [LICENSE](LICENSE) file for more details.
