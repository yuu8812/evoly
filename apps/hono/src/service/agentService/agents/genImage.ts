import OpenAI from "openai"
const openai = new OpenAI({
  apiKey: Bun.env.OPENAI_API_KEY
})

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2 // φ ≈ 1.618

const PROMPT = {
  EYES: {
    FULLY_OPEN: `
    Draw a high-quality anime-style female eye component with delicate touch and detailed drawing technique on a transparent background.
    
    [REQUIREMENTS with GOLDEN RATIO]
    - Type: ONLY iris, pupil, eyelashes, and eyebrow
    - ABSOLUTE REQUIREMENT: NO SKIN, NO EYELIDS, NO SURROUNDING TISSUE
    - Pure eye component with zero additional elements
    - Style: soft, elegant anime look with delicate touch and detailed drawing
    - Eyelashes: Gossamer-thin, with intricate fine lines
    - Iris: Soft color with luminous, translucent highlights
    - Eye color: Dreamy blue or teal with gentle color gradients
    - Background: FULLY transparent
    - Resolution: 1024x1024
    - Position: perfectly centered
    
    [SIZE STANDARDIZATION with GOLDEN RATIO]
    - Eye width: exactly 60% of canvas width (614px on 1024x1024 canvas)
    - Eye height: proportioned using Golden Ratio (φ ≈ ${GOLDEN_RATIO.toFixed(3)})
    - Eyebrow position: consistent distance of 100px above eye center
    
    [AESTHETIC PRINCIPLES]
    - Eye openness: fully open
    - Expression: gentle, dreamlike, slightly ethereal
    - Color palette: Refined, soft, with meticulous attention to detail
    `,

    CLOSED: `
    Draw a high-quality anime-style female eye component with delicate touch and detailed drawing technique on a transparent background.
    
    [REQUIREMENTS with GOLDEN RATIO]
    - Type: ONLY closed eye line, eyelashes, and eyebrow
    - ABSOLUTE REQUIREMENT: NO SKIN, NO EYELIDS, NO SURROUNDING TISSUE
    - Pure eye component with zero additional elements
    - Style: soft, elegant anime look with delicate touch and detailed drawing
    - Closed eye line: Delicate, slightly curved with precise linework
    - Eyelashes: Gossamer-thin, with meticulous detail
    - Background: FULLY transparent
    - Resolution: 1024x1024
    - Position: perfectly centered
    
    [SIZE STANDARDIZATION with GOLDEN RATIO]
    - Eye width: exactly 60% of canvas width (614px on 1024x1024 canvas)
    - Eyebrow position: consistent distance of 100px above eye center
    - CRITICAL: closed eye line must maintain same horizontal space as open eye version
    
    [AESTHETIC PRINCIPLES]
    - Eye openness: closed
    - Expression: peaceful, dreamy, with hint of gentle emotion
    - Color palette: Soft, refined tones with precise detail work
    `
  },

  FACE: {
    NORMAL: `
    Draw an anime-style female head and face using delicate touch and detailed drawing technique on a fully transparent background.
  
    [REQUIREMENTS with GOLDEN RATIO]
    - ABSOLUTE REQUIREMENT: NO EYES, NO EYEBROWS, NO MOUTH, NO SKIN
    - Character: Minimal face structure suggestion
    - Style: Elegant anime aesthetic with refined, detailed linework
    - Include ONLY:
      * Soft hair outline
      * Minimal, finely-detailed nose suggestion
      * Soft, feminine ear outline
    - Hair: Medium to long, flowing with natural movement
    - Hair Color: Soft, harmonious palette with precise gradient work
    - Head centered, facing forward
    - No shadows, no hard lines
    - No background, no defined borders
    - Image resolution: 1024x1024
    
    [SIZE STANDARDIZATION with GOLDEN RATIO]
    - Head width: exactly 85% of canvas width (870px on 1024x1024 canvas)
    - Head height: proportioned using Golden Ratio (φ ≈ ${GOLDEN_RATIO.toFixed(3)})
    - Face position: centered with delicate, precise linework
    - Nose position: absolute minimal definition at canvas center
    
    [AESTHETIC PRINCIPLES]
    - Overall mood: Ethereal, poetic, dreamlike
    - Color palette: Soft with meticulous attention to detail
    - Emotional quality: Delicate, introspective, gentle
    `
  },

  MOUTH: {
    OPEN: `Draw a single anime-style open mouth component using delicate touch and detailed drawing technique on a fully transparent background.
    [REQUIREMENTS with GOLDEN RATIO]
    - ABSOLUTE REQUIREMENT: NO SKIN, NO FACIAL TISSUE
    - Type: ONLY mouth interior, teeth, and lip edges
    - Style: Soft, feminine anime look with refined, detailed work
    - Render ONLY:
      * Lip edges with delicate linework
      * Teeth minimal suggestion
      * Mouth interior color detail
    - No lip outline, no facial context
    - Expression: Subtle, slightly surprised, dreamlike
    - Centered on canvas
    - Image resolution: 1024x1024
    - Background: Fully transparent
    
    [SIZE STANDARDIZATION with GOLDEN RATIO]
    - Mouth width: exactly 45% of canvas width (460px on 1024x1024 canvas)
    - Mouth height: proportioned using Golden Ratio (φ ≈ ${GOLDEN_RATIO.toFixed(3)})
    - Precise color gradients within exact position boundaries`,

    CLOSED: `
    Draw a single anime-style closed mouth component using delicate touch and detailed drawing technique on a fully transparent background.

    [REQUIREMENTS with GOLDEN RATIO]
    - ABSOLUTE REQUIREMENT: NO SKIN, NO FACIAL TISSUE
    - Type: ONLY lip edges and minimal lip shape
    - Style: Soft, feminine anime look with refined, detailed work
    - Render ONLY:
      * Delicate lip curve
      * Soft color detail
      * Minimal lip edge definition
    - No lip outline, no facial context
    - Expression: Warm, gentle smile with dreamy quality
    - Centered on canvas
    - Image resolution: 1024x1024
    - Background: Fully transparent
    
    [SIZE STANDARDIZATION with GOLDEN RATIO]
    - Mouth width: exactly 45% of canvas width (460px on 1024x1024 canvas)
    - CRITICAL: Maintain same horizontal space as open mouth version
    - Smile curve guided by Golden Ratio principles
    `
  }
}
const genPreCondition = (str: string) => {
  return `Precondition: ${str}
  You Should generate the image based on the precondition.
  `
}

export const genImageAgent = {
  generateEyesOpen: async (str: string) => {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: genPreCondition(str) + PROMPT.EYES.FULLY_OPEN,
      size: "1024x1024",
      background: "transparent"
    })
    return response.data
  },
  generateEyesClosed: async (str: string) => {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: genPreCondition(str) + PROMPT.EYES.CLOSED,
      size: "1024x1024",
      background: "transparent"
    })
    return response.data
  },
  generateFaceNormal: async (str: string) => {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: genPreCondition(str) + PROMPT.FACE.NORMAL,
      size: "1024x1024",
      background: "transparent"
    })
    return response.data
  },
  generateMouthOpened: async (str: string) => {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: genPreCondition(str) + PROMPT.MOUTH.OPEN,
      size: "1024x1024",
      background: "transparent"
    })
    return response.data
  },
  generateMouthClosed: async (str: string) => {
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: genPreCondition(str) + PROMPT.MOUTH.CLOSED,
      size: "1024x1024",
      background: "transparent"
    })
    return response.data
  }
}
