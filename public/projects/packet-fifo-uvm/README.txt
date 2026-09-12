AXI4-Stream Packet FIFO
=======================

Drop the images for this project into THIS folder, using these exact filenames.
The site picks them up automatically — no code change needed.

  architecture.png
      [diagram] Block diagram: AXI4-Stream master → FIFO (wr_ptr / wr_ptr_commit / rd_ptr) → MAC

  waveform-drop.png
      [waveform] Questa wave window showing an oversize packet being sunk and the write pointer rewinding

  coverage.png
      [chart] Questa coverage report — packet length bins, backpressure policy crosses

  uvm-env.png
      [diagram] UVM hierarchy: master agent, slave agent, scoreboard, coverage, assertions

Aim for ~1600px on the long edge. Images are cropped with object-cover to fit the frame.