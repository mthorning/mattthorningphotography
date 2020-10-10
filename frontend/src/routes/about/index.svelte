<style>
  div {
    max-width: 56em;
    margin: auto;
  }
  h2 {
    border-top: 1px solid #777;
    margin-top: 50px;
    padding-top: 20px;
  }
  .photo {
    width: 100%;
    border: 1px solid #f0f0f0;
    height: 300px;
    margin: 20px auto;
    background-image: url(/profile.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  p {
    text-align: justify;
  }
</style>

<svelte:head>
  <title>About</title>
</svelte:head>

<div>
  <h1>Hi, I'm Matt.</h1>
  <div data-test="photo" class="photo" />

  <div data-test="some-gibberish">
    <p>
      I'm a software developer who also enjoys taking photos; this site is for
      showing off some of my favourite shots. I mostly do landscape photography
      in my home county of Cornwall in the UK, although I will take photos of
      any small animals that cross my path if I'm quick enough!
    </p>
    <p>
      I have been dabbling in photography on and off for the last ten years but
      I've really started getting back into it since the beginning of 2020, I
      guess this might have something to do with lockdown! I'm hoping to build
      up a collection of images here and would like to offer the option to
      purchase prints at some point so please do keep checking back to see
      what's on offer.
    </p>

    <p>
      If you want to get in touch for any reason then please contact me either
      <a href="/contact">through my contact page</a>
      or the social media links above. :)
    </p>
  </div>
  <div data-test="gear-list">
    <h2>Gear List</h2>
    <p>
      What photographer doesn't love talking about gear! This is the equipment
      that I currently use for those that are interested, not all images will
      have been created using this equipment but I will endeavour to keep this
      list up-to-date with the equipment I am currently using.
    </p>
    <p>Main kit:</p>
    <ul>
      <li>Sony Alpha A7iii</li>
      <li>Sony 24-105mm f/4 G OSS lens</li>
      <li>Mindshift Gear Backlight 18l rucksack</li>
      <li>
        3 Legged Thing Albert 2.0 carbon fibre tripod with Airhead ballhead
      </li>
    </ul>
    <p>Filters:</p>
    <ul>
      <li>Kase Wolverine Magnetic Circular Polariser</li>
      <li>Kase Wolverine 100mm ND 10 stop filter</li>
      <li>Kase Wolverine 100mm ND 6 stop filter</li>
      <li>Kase Wolverine 100mm ND 3 stop Reverse Grad filter</li>
      <li>Kase Wolverine 100mm ND 3 stop Soft Grad filter</li>
    </ul>
    <p>Processing</p>
    <ul>
      <li>Dell 9360 XPS 13 laptop</li>
      <li>Adobe Lightroom Classic</li>
      <li>Adobe Photoshop 2020</li>
    </ul>
  </div>

</div>
