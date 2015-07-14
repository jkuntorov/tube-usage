# London Tube Usage Visualisation
An interactive visualisation built with the D3 JavaScript framework, utilising open data from TfL.

## Structure
```
assets/             --> All of the assets needed by the application to run
  images/           --> Images and graphics used in the interface
  js/               --> All of the D3 & JS magic happens in this directory
    data.json       --> The JSON data extracted with the Tube Data Collector apps (refer to link below)
    main.js         --> Visualisation initialisation and redraw functions
    helpers.js      --> Geographic and model helpers
    interactive.js  --> Scripts for the UI bindings and updates triggered by the visualisation
    autoplay.js     --> Logic for the autoplay functionality
  less/             --> LESS CSS source file and a compiled CSS file to style the interface
index.html          --> The homepage, containing an empty <div> for the visualisation, and the UI controls
```

## More information
For more information about how the data was extracted, please refer to [this repository](https://github.com/jkuntorov/tfl-tube-data-collector).

You can visit the live infographic [on my website](http://kuntorov.com/tube).
