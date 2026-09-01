---
number: "01"
title: "Monaco 2026 - Qualifying Analysis"
category: "F1 · Telemetry Analysis · Python · FastF1"
description: "An investigation into how Kimi Antonelli secured pole position over Max Verstappen through comparative telemetry analysis."
subtitle: "How did Kimi Antonelli secure pole position over Max Verstappen?"
featured: true
---

## METHODOLOGY

The analysis was conducted in Python using FastF1 to extract qualifying telemetry. The full data processing, analysis and visualisation code is available in the accompanying Jupyter notebook.

[View the full project on GitHub →](https://github.com/omcfadden6-oss/Motorsport-Projects/blob/main/FastF1/monaco_quali2026.ipynb)

## 01 · OVERVIEW

### Where was the time gained?

We first take a look at the data over the whole lap in order to get an overview of how and where exactly the advantages were gained and lost. We start with a simple delta map to get a visual of where each driver was dominant.

![Track map showing time delta between Kimi Antonelli and Max Verstappen around Monaco](/images/projects/monaco/delta-track-map.png)

*Time delta mapped onto the Monaco circuit, highlighting where the lap time advantage develops.*

The evolution of the delta is particularly interesting. Aside from Turns 5 and 6, Verstappen has the advantage over Antonelli for the first half of the lap. Then, at Turn 10, the advantage goes to Antonelli. It's worth noting that this happens after the high-speed section of the track — an area in which the Mercedes car has been particularly dominant. After Turn 17, Verstappen manages to claw back some time, but it is not enough, and Antonelli finishes 0.43 seconds ahead.

#### Looking at the data

![Full lap telemetry comparison between Kimi Antonelli and Max Verstappen at Monaco](/images/projects/monaco/full-lap-telemetry.png)

*Full-lap comparison of time delta, speed, acceleration, throttle and braking.*

The lap demonstrates a clear contrast in the drivers' strengths. Verstappen consistently gains time through later braking and stronger corner entry performance, while Antonelli is able to recover this time through greater speed retention and stronger corner exits. This pattern is particularly evident in the final sector, where Verstappen repeatedly recovers time on corner entry but Antonelli's stronger exits allow him to maintain the overall advantage. The remaining unexplained changes in delta at Turns 5–6 and the apparent speed plateaus in Sector 3 provide useful areas for further investigation using racing line, throttle, gear and RPM data.

## 02 · TURNS 5–6

### Investigating the Delta Spikes

#### Racing Line

An initial look at the racing lines taken by both drivers shows no clear differences — further analysis is needed to identify where time was lost and gained in this turn sequence.

![Racing line comparison through Turns 5 and 6](/images/projects/monaco/turn-5-6-racing-line.png)

*Racing line comparison through Turns 5 and 6.*

#### Throttle, gearing and engine behaviour

The differences in speed through Turns 5 and 6 are accompanied by differences in throttle application, gear selection and RPM.

![Throttle, gear, RPM and braking comparison through Turns 5 and 6](/images/projects/monaco/turn-5-6-gear.png)

*Throttle, gear, RPM and braking through Turns 5 and 6.*

The gear telemetry does a much better job of revealing where the delta changes originate:

Antonelli drops down to 1st gear for Turn 5, and the heavy engine braking of 1st gear sheds his speed rapidly, explaining why he is able to get back on the throttle earlier on exit. Conversely, Verstappen elects to use 2nd gear for Turn 5, causing his revs to drop, and allowing Antonelli to gain time on entry. However, avoiding the additional downshift gives Verstappen more momentum coming out of the corner, allows him to get up to full throttle, while Antonelli only gets up to around 90%, and lifts earlier. This should give Verstappen a higher apex speed.

Turn 6 is a similar story — Antonelli once again uses a lower gear on approach, and is able to get back on the throttle earlier, with Verstappen's use of 3rd gear causing his engine revs to drop, allowing Antonelli to claw back some time. However, this time Verstappen does a rapid double downshift, meaning he benefits from more engine braking, stabilizing the rear axle and allowing him to spend less time on the brake pedal, thus achieving a better exit.

#### Speed, Acceleration & Braking

The speed, acceleration and braking data completes the full picture of how the delta shifts occurred.

![Telemetry comparison through Turns 5 and 6](/images/projects/monaco/turn-5-6-overall.png)

*Speed, acceleration, braking and time delta through Turns 5 and 6.*

**Turn 5 — Antonelli gains through the corner, but Verstappen recovers on exit**

Looking at the speed trace at ~1050m, it can be seen that Antonelli carries greater speed into the initial phase of the braking zone and decelerates less aggressively. Additionally, his lower gear meant that his engine revs were higher on approach, allowing him to gain time on Verstappen. Antonelli gets back on the throttle first, and continues to gain through the middle of the corner.

However, because Antonelli is limited by 1st gear, he carries less momentum through the corner and his acceleration curve plateaus. Conversely, Verstappen's use of 2nd gear gives him a momentum advantage, a higher apex speed, and allows him to get up to full throttle and hold it for longer, while Antonelli peaks at 90% throttle and lifts earlier. Additionally, the brake plot shows that Verstappen releases the brakes slightly earlier than Antonelli, further contributing to his higher apex speed. This is how Verstappen gains the advantage back on exit.

**Turn 6 — Antonelli gains on entry, but Verstappen's higher corner speed wins out**

This time, it is Verstappen who decelerates less aggressively into the corner. However, his slightly lower speed going into the initial phase of braking causes him to lose time to Antonelli. Additionally, Antonelli once again uses a lower gear on approach, giving him higher engine revs and growing his advantage.

Verstappen's double downshift into the corner means he benefits from more engine braking, allowing him to spend less time on the brakes and giving him a slightly higher apex speed and subsequently, a better exit. As a result, the delta switches back in his favour and continues to increase on exit.

## 03 · TURNS 14–18

### Investigating Verstappen's speed plateaus

Verstappen's speed trace through Turns 14–18 exhibited several apparent plateaus. This prompted a closer investigation into the relationship between speed and RPM in this section of the lap.

![Speed and RPM comparison through Turns 14 to 18](/images/projects/monaco/turns-14-18-speed-rpm.png)

*Comparison of speed and RPM through Turns 14–18.*

The effect is small between Turns 14 and 15, but much more noticeable between Turns 17 and 18. The scatter plot confirms that the flatlines are not plotting errors caused by gaps in the data, but that the data logger is actively repeating the same velocity values over consecutive distances (ironically there is a gap after the plateau at 14-15, but this is not relevant to our investigation).

Physically, a car cannot maintain a constant velocity while its engine revs are actively moving. The RPM graph shows that Verstappen's RPM is fluctuating at the point of both plateaus. Because the engine speed changes continuously during these intervals, the drivetrain is functionally accelerating and decelerating. This mismatch confirms that the vehicle performance is normal, and rules out mechanical limits or battery superclipping.

Instead, these plateaus are a standard technical artifact of the FastF1 framework's resampling engine. Because the raw Formula One Management (FOM) telemetry streams for velocity (CarData) and GPS coordinates (PositionData) are broadcast at different, non-synchronized frequencies, the software must interpolate the channels onto a single distance axis. When the raw stream updates in coarse steps or drops packets over brief stretches, the script "holds" the last recorded speed value until the next update arrives, creating an artificial plateau.

## 04 · CONCLUSION

### What have we learned?

This telemetry analysis reveals the differences in performance over the lap and highlights critical lessons in data literacy:

- **Differing driver styles:** The battle for pole was ultimately decided by contrasting cornering strategies. While Verstappen optimized apex speed, Antonelli's "slow-in, fast-out" approach won out in the end. By prioritizing an earlier apex, Antonelli was able to unlock earlier throttle application and hold a higher net advantage across the lap.
- **The full telemetry picture:** Looking at the speed trace in isolation does not paint a complete picture. As proven in the Turn 5 and 6 analysis, velocity is merely the end product of a complex matrix. To diagnose why a driver is faster, an analyst must look at the interactions between gear selection, engine RPM, throttle application and braking.
- **Limitations of data:** Raw telemetry has inherent limitations that warrant caution. GPS sampling rates can cause gaps in data and obscure the racing line taken by a driver. Furthermore, software interpolation effects - such as the artificial speed plateaus in Turns 14-15 and 17-18 - should always be cross-referenced with other data channels before drawing conclusions on vehicle performance.

[View the full project on GitHub →](https://github.com/omcfadden6-oss/Motorsport-Projects/blob/main/FastF1/monaco_quali2026.ipynb)