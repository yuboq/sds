# Bugs/TODO
- Attach sprites to players
  - player icon  1:1 attachement to player body
  - Use part of the png instead of entire image to represent player
  - attach enemy icons to enemies

- Circle reset on game over
- Add color to represent your dude
- Add sprites for healthkits
- Bot disappears on death
- Remove collision from circle: player takes extra damage if outside circle
- AOE cough cone


# Ideas/game mechanics/Features

## Everyone starts with covid (infection level is hidden from player)
## WASD for movement, arrow keys for direction


## AOE cough cone (based on the infection level)
- range and size of aoe cough are fixed (your infection level doesn't matter)
- effectiveness is determined by your infection level
- disappears immediately (can't stand in your own cough)
- implement mechanic to prevent spam coughing

## % Health decrase based on level of infection -win by last man standing
- globally visible healthbar: player color indicates current health

## Get med kits to become more healthy (infect health packages, player dropped health packs)
- 3 use health kit: 1st use is covid free, 2nd use is some covid, 3rd use is lots covid
- covid decays on objects, covid increases on humans
- all med kits spawn on game start (change this later)
- gain health + decrease infection (but cannot go to no infection)
- carry medkits (movement speed decrease)


## method for identifing players/computers (overlay/pixel art generator)
- color the circle
- get rid of the orientation line


# Future ideas

- pin camera to yourself/make camera follow player (stage.onviewport)
- Multiplayer (internet/invite system like catan)
- emote system? (super late feature)
- dead players can become ghosts that can place fake med kits/ makes traps
- immune system (health/immune/covid)


