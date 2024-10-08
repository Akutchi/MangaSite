# MangaSite

# Overview

This is a personal project used to learn how to manipulate React & Node.
The choice of technologie for the database was MariaDB.
This project was done with a friend of mine. While he worked on the front-end, I worked mainly on the back-end; although I also touched the front-end (the Router System, the base for the "Reader" part, and all the logic for API calls).

This project consist in the creation of a website for Manga viewing and was inspired by [Catmanga](https://web.archive.org/web/20210430012045/http://catmanga.org/). There is also an administrative part that I did which can be viewed [here](https://github.com/Akutchi/MangaSite_Admin).

Visuals :

| ![Home](./doc/Visuals/VisualHome.png) |
|:--:|
| *Home Page* |

| ![AllSeries](./doc/Visuals/VisualSeries.png) |
|:--:|
| *List of all Series* |

| ![One Page](./doc/Visuals/VisualPage.png) |
|:--:|
| *One Manga Information* |

| ![Reader](./doc/Visuals/VisualReader.png) |
|:--:|
| *Reader. You can navigate by clicking on the left/right of the image. Test Image Credit : https://brookmiles.ca/* |

# Installation
To have a smooth installation, please clone the repository in ~/Desktop [1].

To install all the libraries, please use the following doc in order,
- [server_setup](./doc/server/server_setup.md)
- [front_setup](./doc/front/front_setup.md)

If you want to know more about the website in details, please check the [API](./doc/API/Internal_API_Documentation.md), the [Encryption scheme](./doc/server/Data_Encryption_Admin.md) or the [Database](<./doc/bdd/Mangas.svg>)

[1] I only accounted for Linux users.

# To Be Done

This version is still in developpment as several components still needs to be created :
- The reader needs to be polished
- The reader still has yet to include reading settings
- Metadata are to be added when sharing a link
- Such a link should redirect to the correct manga page if asked

