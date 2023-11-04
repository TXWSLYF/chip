use js_sys::Math;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    // The `console.log` is quite polymorphic, so we can bind it with multiple
    // signatures. Note that we need to use `js_name` to ensure we always call
    // `log` in JS.
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u8(a: u8);

    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_u16(a: u16);

    // Multiple arguments too!
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    fn log_many(a: &str, b: &str);
}

const VIDEO_WIDTH: usize = 64;
const VIDEO_HEIGHT: usize = 32;
const SCREEN_PIXEL_COUNT: usize = 2048; // VIDEO_WIDTH * VIDEO_HEIGHT
const MEMORY_SIZE: usize = 4096;
const KEY_COUNT: usize = 16;
const FONTSET_START_ADDRESS: u16 = 0x00;
const START_ADDRESS: usize = 0x200;
const FONTSET_SIZE: usize = 80;

const FONT_SET: [u8; FONTSET_SIZE] = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80, // F
];

#[wasm_bindgen]
pub struct Chip8 {
    // 16 8-bit Registers
    registers: [u8; 16],
    // 4K Bytes of Memory
    memory: [u8; MEMORY_SIZE],
    // 16-bit Index Register
    index: u16,
    // 16-bit Program Counter
    pc: u16,
    // 16-level Stack
    stack: [u16; 16],
    // 8-bit Stack Pointer
    sp: u8,
    // 8-bit Delay Timer
    delay_timer: u8,
    // 8-bit Sound Timer
    sound_timer: u8,

    keypad: [bool; KEY_COUNT],
    screen: [u8; SCREEN_PIXEL_COUNT],
}

impl Chip8 {
    fn inc_pc(&mut self) {
        self.pc = self.pc.wrapping_add(2);
    }
}

#[wasm_bindgen]
impl Chip8 {
    pub fn new() -> Chip8 {
        let mut memory = [0; MEMORY_SIZE];

        for i in 0..FONTSET_SIZE {
            memory[FONTSET_START_ADDRESS as usize + i] = FONT_SET[i];
        }

        Chip8 {
            registers: [0; 16],
            memory,
            index: 0,
            pc: START_ADDRESS as u16,
            stack: [0; 16],
            sp: 0,
            delay_timer: 0,
            sound_timer: 0,
            keypad: [false; KEY_COUNT],
            screen: [0; SCREEN_PIXEL_COUNT],
        }
    }

    pub fn video_width() -> usize {
        VIDEO_WIDTH
    }

    pub fn video_height() -> usize {
        VIDEO_HEIGHT
    }

    pub fn memory(&self) -> *const u8 {
        self.memory.as_ptr()
    }

    pub fn screen(&self) -> *const u8 {
        self.screen.as_ptr()
    }

    pub fn cycle(&mut self) {
        let opcode = (((self.memory[self.pc as usize]) as u16) << 8)
            | (self.memory[(self.pc + 1) as usize] as u16);

        self.inc_pc();

        let opcode_prefix = (opcode & 0xf000) >> 12;

        match opcode_prefix {
            0 => match opcode {
                // clear
                0x00E0 => {
                    for i in 0..self.screen.len() {
                        self.screen[i] = 0;
                    }
                }
                // Exit a subroutine
                0x00EE => {
                    self.sp = self.sp.wrapping_sub(1);
                    self.pc = self.stack[self.sp as usize];
                }
                _ => {}
            },
            // 1NNN jump NNN
            1 => {
                let address = opcode & 0x0fff;
                self.pc = address;
            }
            // 2NNN NNN Call a subroutine
            2 => {
                let address = opcode & 0x0fff;
                self.stack[self.sp as usize] = self.pc;
                self.sp = self.sp.wrapping_add(1);
                self.pc = address
            }
            // 3XNN if vx != NN then
            3 => {
                let vx = (opcode & 0x0f00) >> 8;
                let byte = (opcode & 0x00ff) as u8;

                if self.registers[vx as usize] == byte {
                    self.inc_pc();
                }
            }
            // 4XNN if vx == NN then
            4 => {
                let vx = (opcode & 0x0f00) >> 8;
                let byte = (opcode & 0x00ff) as u8;
                if self.registers[vx as usize] != byte {
                    self.inc_pc();
                }
            }
            // 5XY0 if vx != vy then
            5 => {
                let vx = (opcode & 0x0F00) >> 8;
                let vy = (opcode & 0x00F0) >> 4;
                if self.registers[vx as usize] == self.registers[vy as usize] {
                    self.inc_pc();
                }
            }
            // 6XNN vx := NN
            6 => {
                let vx = (opcode & 0x0f00) >> 8;
                let byte = (opcode & 0x00ff) as u8;

                self.registers[vx as usize] = byte;
            }
            // 7XNN vx += NN
            7 => {
                let vx = (opcode & 0x0f00) >> 8;
                let byte = (opcode & 0x00ff) as u8;

                self.registers[vx as usize] = self.registers[vx as usize].wrapping_add(byte);
            }
            8 => {
                let opcode_suffix = opcode & 0x000f;
                match opcode_suffix {
                    // 8XY0 vx := vy
                    0 => {
                        let vx = (opcode & 0x0F00) >> 8;
                        let vy = (opcode & 0x00F0) >> 4;

                        self.registers[vx as usize] = self.registers[vy as usize];
                    }
                    // 8XY1 vx |= vy Bitwise OR
                    1 => {
                        let vx = (opcode & 0x0F00) >> 8;
                        let vy = (opcode & 0x00F0) >> 4;

                        self.registers[vx as usize] |= self.registers[vy as usize];
                    }
                    // 8XY2 vx &= vy Bitwise AND
                    2 => {
                        let vx = (opcode & 0x0F00) >> 8;
                        let vy = (opcode & 0x00F0) >> 4;

                        self.registers[vx as usize] &= self.registers[vy as usize];
                    }
                    // 8XY3 vx ^= vy Bitwise XOR
                    3 => {
                        let vx = (opcode & 0x0F00) >> 8;
                        let vy = (opcode & 0x00F0) >> 4;

                        self.registers[vx as usize] ^= self.registers[vy as usize];
                    }
                    // 8XY4 vx += vy vf = 1 on carry
                    4 => {
                        let vx = (opcode & 0x0F00) >> 8;
                        let vy = (opcode & 0x00F0) >> 4;

                        let sum =
                            self.registers[vx as usize] as u16 + self.registers[vy as usize] as u16;

                        if sum > 255 {
                            self.registers[0xF] = 1;
                        } else {
                            self.registers[0xF] = 0;
                        }

                        self.registers[vx as usize] =
                            self.registers[vx as usize].wrapping_add(self.registers[vy as usize])
                    }
                    // 8XY5 vx -= vy vf = 0 on borrow
                    5 => {
                        let vx = (opcode & 0x0F00) >> 8;
                        let vy = (opcode & 0x00F0) >> 4;

                        if self.registers[vx as usize] > self.registers[vy as usize] {
                            self.registers[0xF] = 1;
                        } else {
                            self.registers[0xF] = 0;
                        }
                        self.registers[vx as usize] =
                            self.registers[vx as usize].wrapping_sub(self.registers[vy as usize])
                    }
                    // 8XY6 vx >>= 1 vf = old least significant bit
                    6 => {
                        let vx = (opcode & 0x0F00) >> 8;
                        self.registers[0xf] = self.registers[vx as usize] & 0x1;
                        self.registers[vx as usize] = self.registers[vx as usize].wrapping_shr(1);
                    }
                    7 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        let vy = ((opcode & 0x00F0) >> 4) as usize;

                        if self.registers[vy] > self.registers[vx] {
                            self.registers[0xF] = 1;
                        } else {
                            self.registers[0xF] = 0;
                        }

                        self.registers[vx as usize] =
                            self.registers[vy as usize].wrapping_sub(self.registers[vx as usize])
                    }
                    0xe => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;

                        self.registers[0xF] = (self.registers[vx] & 0x80) >> 7;
                        self.registers[vx] = self.registers[vx].wrapping_shl(1);
                    }
                    _ => {}
                }
            }
            9 => {
                let vx = ((opcode & 0x0F00) >> 8) as usize;
                let vy = ((opcode & 0x00F0) >> 4) as usize;

                if self.registers[vx] != self.registers[vy] {
                    self.inc_pc()
                }
            }
            0xa => {
                let address = opcode & 0x0fff;
                self.index = address;
            }
            0xb => {
                let address = opcode & 0x0fff;
                self.pc = address.wrapping_add(self.registers[0] as u16);
            }
            0xc => {
                let vx = ((opcode & 0x0F00) >> 8) as usize;
                let byte = (opcode & 0x00ff) as u8;
                let random_number = (Math::random() * 256.0) as u8;

                self.registers[vx] = byte & random_number;
            }
            0xd => {
                let vx = ((opcode & 0x0F00) >> 8) as usize;
                let vy = ((opcode & 0x00F0) >> 4) as usize;
                let height = (opcode & 0x000f) as usize;

                self.registers[0xF] = 0;

                for i in 0..height {
                    let sprite_byte = self.memory[(self.index + i as u16) as usize];
                    let y_pos = (self.registers[vy] as usize + i) % VIDEO_HEIGHT;

                    for j in 0..8 {
                        let x_pos = (self.registers[vx] as usize + j) % VIDEO_WIDTH;
                        let screen_pixel_index = y_pos * VIDEO_WIDTH + x_pos;
                        let sprite_pixel = sprite_byte & (0x80 >> j);

                        let screen_pixel = self.screen[screen_pixel_index];

                        if sprite_pixel != 0 {
                            if screen_pixel == 1 {
                                self.registers[0xF] = 1;
                                self.screen[screen_pixel_index] = 0
                            } else {
                                self.screen[screen_pixel_index] = 1
                            }
                        }
                    }
                }
            }
            0xe => {
                let opcode_suffix = opcode & 0x000f;
                match opcode_suffix {
                    // Ex9E
                    0xe => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        let key = self.registers[vx];

                        if self.keypad[key as usize] {
                            self.inc_pc()
                        }
                    }

                    // ExA1
                    0x1 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        let key = self.registers[vx];

                        if !self.keypad[key as usize] {
                            self.inc_pc()
                        }
                    }

                    _ => {}
                }
            }
            0xf => {
                let opcode_suffix = opcode & 0x00ff;

                match opcode_suffix {
                    0x07 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        self.registers[vx] = self.delay_timer;
                    }
                    0x0a => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;

                        if let Some(index) = self.keypad.iter().position(|&x| x) {
                            self.registers[vx] = index as u8;
                        } else {
                            self.pc = self.pc.wrapping_sub(2)
                        }
                    }
                    0x15 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        self.delay_timer = self.registers[vx]
                    }
                    0x18 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        self.sound_timer = self.registers[vx]
                    }
                    0x1e => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        self.index = self.index.wrapping_add(self.registers[vx] as u16)
                    }
                    0x29 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        let digit = self.registers[vx] as u16;
                        self.index = FONTSET_START_ADDRESS + (5 * digit);
                    }
                    0x33 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        let mut value = self.registers[vx];

                        self.memory[(self.index + 2) as usize] = value % 10;
                        value /= 10;

                        self.memory[(self.index + 1) as usize] = value % 10;
                        value /= 10;

                        self.memory[self.index as usize] = value % 10;
                    }
                    0x55 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;

                        for i in 0..(vx + 1) {
                            self.memory[self.index as usize + i] = self.registers[i];
                        }
                    }
                    0x65 => {
                        let vx = ((opcode & 0x0F00) >> 8) as usize;
                        for i in 0..(vx + 1) {
                            self.registers[i] = self.memory[self.index as usize + i];
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }

        if self.delay_timer > 0 {
            self.delay_timer = self.delay_timer.wrapping_sub(1);
        }

        if self.sound_timer > 0 {
            self.sound_timer = self.sound_timer.wrapping_sub(1);
        }
    }

    pub fn load_rom(&mut self, data: &[u8]) {
        for i in 0..data.len() {
            self.memory[START_ADDRESS + i] = data[i];
        }
    }

    pub fn set_keypad(&mut self, index: usize, value: bool) {
        self.keypad[index] = value
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_u8_to_u16() {
        let a_u8: u8 = 0b00001001;
        let a_u16 = (a_u8 as u16) << 8;

        println!("a_u8={}", a_u8);
        println!("a_u16={}", a_u16);

        assert_eq!(a_u16, 0b100100000000);
    }
}
