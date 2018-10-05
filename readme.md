What does the night sky look like in other places in the galaxy?
===

The aim of this project - which you can see live here: [https://blemoine.github.io/star-map](https://blemoine.github.io/star-map) - was to answer the question: what would the night sky be like in the neighbourhood of other stars?

If you're an SF writer, you might want to know what the sky would look like around the planet or spaceship you're describing. 
But this project is also useful for people to understand the size of the universe: you could see that moving one light-year in a direction will not change the sky much, because stars are incredibly distant from each other. 
As a base for comparison, the Milky Way is 100 000 light-years wide. 


Navigation
---


You can move forward and backward by using the keyboard arrows up (`↑`) and down (`↓`). You can also use `⇧ Shift` +` ↑` or `⇧ Shift` + `↓` to move faster. 
And you will want to move faster, because as previously said: space is big.  

You can look at the sky around you either by rotating the point of view with the keyboard `q`,`w`,`e`,`a`,`s`,`d` or by doing a drag/drop move with your mouse.

Simplification
---

### Distance

The distance of stars from the earth and, as a consequence, their position are not in fact as well known as we could hope.
For example, you can read [here](https://en.wikipedia.org/wiki/Polaris#Distance) the debate surrounding the distance of Polarism 
which we know to be somewhere between 330 and 450 light-years &mdash; 120 light-years is a HUGE error margin. 
There are multiple methods to measure the distance of a star, but the farther it is, the less precise the given value. 
In fact, the [more accurate method](https://en.wikipedia.org/wiki/Photometric_parallax_method), only works for stars that are less than ~30 light-years away.
In conclusion, I've arbitrary limited the distance to which you can move around the earth to ~300 light-years, to avoid completely absurd rendering.


### Non-star object

Space contains a lot more than stars: planets, comets, galaxies, etc. But with only your eyes as optical instrument, those are hard to see if you're not really close, 
or they only appear as some kind of fuzzy light. So, to simplify the computation, the rendered sky will only show stars. If from Earth you could see some planets, 
as soon as you moved some light-days, you won't be able to see them anyway. And we don't know exo-planets well enough to display them when you're looking from the neighbourhood of other stars.

### Magnitude

The magnitude scale was originally created to sort night sky objects by luminosity into six different groups. 
Nowadays, magnitude range is unbounded (from Earth, the Sun has a magnitude of `-26.74`; the Hubble Telescope can see objects with a magnitude of `31` ), but our scale sticks to the original magnitude range. 
In conclusion, we will never display an object with a magnitude higher than 6. 
 
 
 
 Thanks
 ---
 
 * The stars data comes from Astronexus: [http://www.astronexus.com/hyg](http://www.astronexus.com/hyg). 
   The data itself is available here: [https://github.com/astronexus/HYG-Database](https://github.com/astronexus/HYG-Database)  
 * Spectral type informations come from: [http://www.isthe.com/chongo/tech/astro/HR-temp-mass-table-byhrclass.html](http://www.isthe.com/chongo/tech/astro/HR-temp-mass-table-byhrclass.html)  