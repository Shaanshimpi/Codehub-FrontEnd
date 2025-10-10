// Design tokens for consistent UI across exercise components
export const designTokens = {
  // Modern, aesthetic color palette - carefully balanced for appeal without overwhelm
  colors: {
    // Vibrant but sophisticated primary (Indigo-Blue gradient)
    primary: {
      50: "#f0f4ff",
      100: "#e0e9ff",
      200: "#c7d6fe",
      300: "#a5b8fc",
      400: "#8b93f8",
      500: "#6d72f2", // Main primary - Modern purple-blue
      600: "#5b62ec",
      700: "#4c52d9",
      800: "#3e45b0",
      900: "#363c8b",
      950: "#242856",
    },

    // Warm accent color (Coral-Pink gradient)
    accent: {
      50: "#fef7f0",
      100: "#feebdc",
      200: "#fcd4b8",
      300: "#f9b589",
      400: "#f58c58",
      500: "#f16935", // Warm coral
      600: "#e2512d",
      700: "#bc3f28",
      800: "#963428",
      900: "#782e24",
      950: "#411612",
    },

    // Modern purple (for premium/advanced features)
    purple: {
      50: "#faf7ff",
      100: "#f3ecff",
      200: "#e9dcff",
      300: "#d7c0ff",
      400: "#bf98ff",
      500: "#a668ff", // Vibrant purple
      600: "#933dff",
      700: "#8024f5",
      800: "#6b1dcb",
      900: "#5a1aa5",
      950: "#3b0a70",
    },

    // Fresh success colors (Mint-Green gradient)
    success: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981", // Modern mint green
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22",
    },

    // Warning colors (for hints, cautions)
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b", // Main warning
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },

    // Sophisticated error colors (Rose-Red gradient)
    error: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e", // Modern rose-red
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
      950: "#4c0519",
    },

    // Neutral colors (for text, backgrounds)
    neutral: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },

    // Enhanced code syntax colors (Modern VSCode-inspired)
    code: {
      background: "#0d1117", // GitHub dark background
      backgroundAlt: "#161b22", // Slightly lighter background
      text: "#f0f6fc", // Crisp white text
      comment: "#8b949e", // Subtle gray comments
      keyword: "#ff7b72", // Coral keywords
      string: "#a5d6ff", // Sky blue strings
      number: "#79c0ff", // Light blue numbers
      function: "#d2a8ff", // Purple functions
      variable: "#ffa657", // Orange variables
      type: "#f85149", // Red types
      constant: "#79c0ff", // Blue constants
      property: "#f0f6fc", // White properties
      operator: "#ff7b72", // Coral operators
      punctuation: "#c9d1d9", // Light gray punctuation
    },

    // Modern glass/frosted effect colors
    glass: {
      white: "rgba(255, 255, 255, 0.75)",
      light: "rgba(255, 255, 255, 0.25)",
      dark: "rgba(15, 23, 42, 0.75)",
      darkLight: "rgba(15, 23, 42, 0.25)",
    },

    // Gradient definitions for modern UI elements
    gradients: {
      primary: "linear-gradient(135deg, #6d72f2 0%, #5b62ec 100%)",
      success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      error: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
      accent: "linear-gradient(135deg, #f16935 0%, #e2512d 100%)",
      purple: "linear-gradient(135deg, #a668ff 0%, #933dff 100%)",
      glass:
        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      dark: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    },
  },

  // Spacing scale - consistent spacing throughout
  spacing: {
    0: "0",
    px: "1px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    11: "2.75rem", // 44px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem", // 96px
    28: "7rem", // 112px
    32: "8rem", // 128px
  },

  // Typography scale
  typography: {
    // Font families
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "Fira Code", "Consolas", "Monaco", "monospace"],
      display: ["Cal Sans", "Inter", "system-ui", "sans-serif"],
    },

    // Font sizes
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },

    // Font weights
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    // Line heights
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.75",
    },

    // Component-specific typography
    heading: {
      h1: "text-3xl font-bold leading-tight",
      h2: "text-2xl font-bold leading-tight",
      h3: "text-xl font-semibold leading-tight",
      h4: "text-lg font-semibold leading-normal",
      h5: "text-base font-semibold leading-normal",
      h6: "text-sm font-semibold leading-normal",
    },

    body: {
      large: "text-lg leading-relaxed",
      normal: "text-base leading-normal",
      small: "text-sm leading-normal",
      tiny: "text-xs leading-normal",
    },

    code: {
      inline: "text-sm font-mono bg-neutral-100 px-1.5 py-0.5 rounded",
      block: "text-sm font-mono leading-relaxed",
    },
  },

  // Border radius scale
  borderRadius: {
    none: "0",
    sm: "0.125rem", // 2px
    DEFAULT: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  // Shadow scale
  boxShadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },

  // Enhanced animation system
  animation: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
    bounce: "600ms",
    slide: "400ms",
  },

  // Modern effects and filters
  effects: {
    blur: {
      sm: "blur(4px)",
      md: "blur(8px)",
      lg: "blur(16px)",
    },
    backdrop: {
      blur: "backdrop-blur(8px)",
      saturate: "backdrop-saturate(180%)",
    },
    glass: "backdrop-blur(8px) backdrop-saturate(180%)",
    glow: {
      primary: "0 0 20px rgba(109, 114, 242, 0.3)",
      success: "0 0 20px rgba(16, 185, 129, 0.3)",
      warning: "0 0 20px rgba(245, 158, 11, 0.3)",
      error: "0 0 20px rgba(244, 63, 94, 0.3)",
      accent: "0 0 20px rgba(241, 105, 53, 0.3)",
      purple: "0 0 20px rgba(166, 104, 255, 0.3)",
    },
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const

// Component state variants
export const componentStates = {
  // Button states
  button: {
    // Primary button (main actions)
    primary: {
      base: "bg-primary-600 hover:bg-primary-700 focus:bg-primary-700 text-white border-transparent",
      disabled:
        "bg-neutral-300 text-neutral-500 cursor-not-allowed border-transparent",
    },

    // Secondary button (alternative actions)
    secondary: {
      base: "bg-white hover:bg-neutral-50 focus:bg-neutral-50 text-neutral-900 border-neutral-300",
      disabled:
        "bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200",
    },

    // Success button (positive actions)
    success: {
      base: "bg-success-600 hover:bg-success-700 focus:bg-success-700 text-white border-transparent",
      disabled:
        "bg-neutral-300 text-neutral-500 cursor-not-allowed border-transparent",
    },

    // Warning button (caution actions)
    warning: {
      base: "bg-warning-500 hover:bg-warning-600 focus:bg-warning-600 text-white border-transparent",
      disabled:
        "bg-neutral-300 text-neutral-500 cursor-not-allowed border-transparent",
    },

    // Danger button (destructive actions)
    danger: {
      base: "bg-error-600 hover:bg-error-700 focus:bg-error-700 text-white border-transparent",
      disabled:
        "bg-neutral-300 text-neutral-500 cursor-not-allowed border-transparent",
    },

    // Ghost button (minimal style)
    ghost: {
      base: "bg-transparent hover:bg-neutral-100 focus:bg-neutral-100 text-neutral-700 border-transparent",
      disabled:
        "bg-transparent text-neutral-500 cursor-not-allowed border-transparent",
    },
  },

  // Input states
  input: {
    base: "border-neutral-300 bg-white text-neutral-900 placeholder-neutral-500",
    focus: "border-primary-500 ring-1 ring-primary-500 outline-none",
    error: "border-error-500 ring-1 ring-error-500 text-error-900",
    disabled:
      "border-neutral-200 bg-neutral-50 text-neutral-500 cursor-not-allowed",
  },

  // Tab states
  tab: {
    active: "border-primary-500 bg-primary-50 text-primary-700",
    inactive:
      "border-transparent text-neutral-600 hover:text-neutral-700 hover:border-neutral-300",
    disabled: "border-transparent text-neutral-400 cursor-not-allowed",
  },

  // Alert states
  alert: {
    info: "bg-primary-50 border-primary-200 text-primary-800",
    success: "bg-success-50 border-success-200 text-success-800",
    warning: "bg-warning-50 border-warning-200 text-warning-800",
    error: "bg-error-50 border-error-200 text-error-800",
  },

  // Loading states
  loading: {
    spinner:
      "animate-spin rounded-full border-2 border-primary-200 border-t-primary-600",
    pulse: "animate-pulse bg-neutral-200 rounded",
    skeleton:
      "animate-pulse bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200",
  },
} as const

// Semantic color mapping for exercise-specific states
export const exerciseColors = {
  difficulty: {
    beginner: "success",
    intermediate: "warning",
    advanced: "error",
  },

  progress: {
    notStarted: "neutral",
    inProgress: "primary",
    completed: "success",
    failed: "error",
  },

  codeState: {
    clean: "success",
    hasErrors: "error",
    needsImprovement: "warning",
    loading: "primary",
  },
} as const

// Utility functions for using design tokens
export const getColor = (path: string) => {
  const keys = path.split(".")
  let value: any = designTokens.colors

  for (const key of keys) {
    value = value?.[key]
  }

  return value
}

export const getSpacing = (size: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[size]
}

export const getComponentState = (
  component: string,
  variant: string,
  state: string = "base"
) => {
  return (componentStates as any)[component]?.[variant]?.[state] || ""
}

// CSS custom properties for runtime theming
export const cssVariables = {
  ":root": {
    "--color-primary": designTokens.colors.primary[500],
    "--color-primary-hover": designTokens.colors.primary[600],
    "--color-success": designTokens.colors.success[500],
    "--color-warning": designTokens.colors.warning[500],
    "--color-error": designTokens.colors.error[500],
    "--spacing-unit": designTokens.spacing[4],
    "--border-radius": designTokens.borderRadius.DEFAULT,
    "--font-family-sans": designTokens.typography.fontFamily.sans.join(", "),
    "--font-family-mono": designTokens.typography.fontFamily.mono.join(", "),
    "--animation-duration": designTokens.animation.normal,
  },
}
