import { DitherModeType } from "./dithering";

export class DitherProcessor {
  private width: number;
  private height: number;
  private buffer: Float32Array;
  private noiseBuffer: Float32Array | null = null;
  private gradientBuffer: Float32Array | null = null;

  // 8x8 Bayer matrix aligned with JPEG blocks
  private static readonly BAYER_MATRIX = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
  ].map((row) => row.map((v) => v / 64)); // Normalize to 0-1

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.buffer = new Float32Array(width * height);
    this.initializeGradient();
  }

  private initializeGradient(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.buffer[y * this.width + x] = x / (this.width - 1);
      }
    }
    this.updateGradientBuffer();
  }

  private updateGradientBuffer(): void {
    this.gradientBuffer = new Float32Array(this.width * this.height);
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const gradientStrength = this.calculateLocalGradient(x, y);
        this.gradientBuffer[idx] = gradientStrength;
      }
    }
  }

  private calculateLocalGradient(x: number, y: number): number {
    if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1)
      return 0;

    const idx = y * this.width + x;
    const horizontal = Math.abs(this.buffer[idx + 1] - this.buffer[idx - 1]);
    const vertical = Math.abs(
      this.buffer[idx + this.width] - this.buffer[idx - this.width]
    );

    return Math.sqrt(horizontal * horizontal + vertical * vertical);
  }

  private quantize(value: number, levels: number): number {
    const step = 1 / (levels - 1);
    return Math.round(value / step) * step;
  }

  private distributeError(
    buffer: Float32Array,
    x: number,
    y: number,
    error: number
  ): void {
    // Constrain error to prevent artifacts
    error = Math.max(-1, Math.min(1, error));

    // Floyd-Steinberg distribution pattern:
    //      X   7/16
    //  3/16  5/16  1/16

    if (x + 1 < this.width) {
      buffer[y * this.width + x + 1] += (error * 7) / 16;
    }
    if (y + 1 < this.height) {
      if (x > 0) {
        buffer[(y + 1) * this.width + x - 1] += (error * 3) / 16;
      }
      buffer[(y + 1) * this.width + x] += (error * 5) / 16;
      if (x + 1 < this.width) {
        buffer[(y + 1) * this.width + x + 1] += (error * 1) / 16;
      }
    }
  }

  private applyFloydSteinberg(levels: number): Uint8ClampedArray {
    const output = new Uint8ClampedArray(this.width * this.height * 4);
    const buffer = new Float32Array(this.buffer);

    // Process each pixel left-to-right, top-to-bottom
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        const oldPixel = buffer[idx];
        const newPixel = this.quantize(oldPixel, levels);
        buffer[idx] = newPixel;

        // Distribute quantization error to neighboring pixels
        const error = oldPixel - newPixel;
        this.distributeError(buffer, x, y, error);
        this.setPixelValue(output, idx, newPixel);
      }
    }

    return output;
  }

  private applyOrderedDither(levels: number): Uint8ClampedArray {
    const output = new Uint8ClampedArray(this.width * this.height * 4);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = y * this.width + x;
        // Get threshold from Bayer matrix, aligned with 8x8 blocks
        const threshold = DitherProcessor.BAYER_MATRIX[y % 8][x % 8];
        // Apply threshold and quantize
        const value = this.buffer[idx] + (threshold - 0.5) / (levels - 1);
        const quantized = this.quantize(value, levels);
        this.setPixelValue(output, idx, quantized);
      }
    }

    return output;
  }

  private applyBlockAlignedRandomDither(
    levels: number,
    amount: number
  ): Uint8ClampedArray {
    const output = new Uint8ClampedArray(this.width * this.height * 4);

    // Generate or update block-aligned noise buffer
    if (!this.noiseBuffer || this.noiseBuffer.length !== this.buffer.length) {
      this.noiseBuffer = new Float32Array(this.width * this.height);

      // Generate noise in 2x2 blocks aligned to 8x8 grid
      for (let y = 0; y < this.height; y += 8) {
        for (let x = 0; x < this.width; x += 8) {
          for (let by = 0; by < 8; by += 2) {
            for (let bx = 0; bx < 8; bx += 2) {
              // Generate one noise value for each 2x2 block
              const noiseValue = Math.random() - 0.5;
              // Apply the same noise value to all pixels in the 2x2 block
              for (let ny = 0; ny < 2; ny++) {
                for (let nx = 0; nx < 2; nx++) {
                  const px = x + bx + nx;
                  const py = y + by + ny;
                  if (px < this.width && py < this.height) {
                    this.noiseBuffer[py * this.width + px] = noiseValue;
                  }
                }
              }
            }
          }
        }
      }
    }

    // Apply noise and quantize
    for (let i = 0; i < this.width * this.height; i++) {
      const value = this.buffer[i] + this.noiseBuffer[i] * amount;
      const quantized = this.quantize(value, levels);
      this.setPixelValue(output, i, quantized);
    }

    return output;
  }

  private setPixelValue(
    output: Uint8ClampedArray,
    idx: number,
    value: number
  ): void {
    const outIdx = idx * 4;
    const color = Math.round(value * 255);
    // Set RGB channels to same value for grayscale
    output[outIdx] = output[outIdx + 1] = output[outIdx + 2] = color;
    // Set alpha channel to fully opaque
    output[outIdx + 3] = 255;
  }

  process(
    mode: DitherModeType,
    levels: number,
    noiseAmount: number
  ): Uint8ClampedArray {
    switch (mode) {
      case "FLOYD_STEINBERG":
        return this.applyFloydSteinberg(levels);
      case "ORDERED":
        return this.applyOrderedDither(levels);
      case "RANDOM":
        return this.applyBlockAlignedRandomDither(levels, noiseAmount);
      default:
        // For 'NONE', just quantize without dithering
        return this.applyBlockAlignedRandomDither(levels, 0);
    }
  }

  resize(width: number, height: number): void {
    if (width === this.width && height === this.height) return;

    this.width = width;
    this.height = height;
    this.buffer = new Float32Array(width * height);
    this.noiseBuffer = null; // Reset noise buffer on resize
    this.gradientBuffer = null; // Reset gradient buffer on resize
    this.initializeGradient();
  }
}
