What does the night sky look like in other places in the galaxy?
===

The objective of this project - that you can see live here: TODO - was to answer the question: what would the night sky  be like in the neighbourhood of other stars?

If you're an SF writer, you could want to know what the sky would look like around the planet or spaceship you're describing. 
But this project is also useful for people to understand the size of the universe: you could see that moving 1 light-year in a direction will not change too mich the sky.
That's because stars are really _really_ far apart from each other. In comparison, the Milky Way is 100 000 light-years wide. 


Navigation
---


You can move forward and backward by using the keyboard arrows up (`↑`) and down (`↓`).
You can look at the sky around you either by rotating the point of view with the keyboard `q`,`w`,`e`,`a`,`s`,`d` or by doing a drag/drop move with your mouse.



Simplification
---

### Distance

The distance to earth of stars (and in consequence their position) are not in fact as well known as we could hope.
For example, you can read [here](https://en.wikipedia.org/wiki/Polaris#Distance) the debate surrounding the distance of Polarism 
that we know is somewhere between 330 and 450 light-years - 120 light-years is a HUGE error margin. 
There is multiple methods to measure the distance of a star but the further, the less precise is the given value. 
In fact, the [more precise method](https://en.wikipedia.org/wiki/Photometric_parallax_method), only works for star that are less than ~30 light-years away.
In conclusion, I've arbitrary limited the distance that you can move around the earth to ~300 light-years to avoid completely absurd display.


### Non-star object

Space contains a lot more things than stars: planets, comets, galaxies, etc. But with only your eyes as optical instrument, those are hard to see if you're not really close, 
or they only appear as some kind of fuzzy light. So to simplify the computation, the displayed sky will only show stars. If from Earth you could see some planets, 
as soon as you moved some light-days, you won't be able to see them anyway. And we don't know exo-planet well enough to display them when you're looking from the neighbourhood of other stars.

### Magnitude

The magnitude scale was originaly created to group night sky object by luminosity into 6 different groups. 
Nowadays, magnitude are unbounded (from Earth, sun has a magnitude of `-26.74`, Hubble Telescope can see object with a magnitude of `31` ), but the scale respect the old grouping. 
In conclusion, we will never display an object with a higher magnitude than 6. 
 
 
 
 Thanks
 ---
 
 * The stars data comes from Astronexus: [http://www.astronexus.com/hyg](http://www.astronexus.com/hyg). 
   The data themselves are available here: [https://github.com/astronexus/HYG-Database](https://github.com/astronexus/HYG-Database)  
 * Spectral type informations come from [http://www.isthe.com/chongo/tech/astro/HR-temp-mass-table-byhrclass.html](http://www.isthe.com/chongo/tech/astro/HR-temp-mass-table-byhrclass.html)  