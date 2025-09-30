/**
 * Path constants for the Learn platform
 */

// Base paths
export const LEARN_PATHS = {
  ROOT: "/Learn",
  TUTORIALS: "/Learn/Tutorials",
  EXERCISES: "/Learn/Exercise",
  VIVY: "/Learn/Vivy",
  VIVY_IMAGE: "/Learn/Vivy-image",
} as const

// Route building utilities
export const buildPath = {
  /**
   * Build tutorial path: /Learn/Tutorials/{langSlug}/{tutSlug?}
   */
  tutorial: (langSlug: string, tutSlug?: string): string => {
    const basePath = `${LEARN_PATHS.TUTORIALS}/${langSlug}`
    return tutSlug ? `${basePath}/${tutSlug}` : basePath
  },

  /**
   * Build exercise path: /Learn/Exercise/{langSlug}/{tutSlug?}/{exerciseSlug?}
   */
  exercise: (
    langSlug: string,
    tutSlug?: string,
    exerciseSlug?: string
  ): string => {
    let path = `${LEARN_PATHS.EXERCISES}/${langSlug}`
    if (tutSlug) {
      path += `/${tutSlug}`
      if (exerciseSlug) {
        path += `/${exerciseSlug}`
      }
    }
    return path
  },

  /**
   * Build Vivy chat path
   */
  vivy: (): string => LEARN_PATHS.VIVY,

  /**
   * Build Vivy image path
   */
  vivyImage: (subPath?: string): string => {
    return subPath
      ? `${LEARN_PATHS.VIVY_IMAGE}/${subPath}`
      : LEARN_PATHS.VIVY_IMAGE
  },
}

// Route validation utilities
export const isLearnPath = (pathname: string): boolean => {
  return pathname.startsWith(LEARN_PATHS.ROOT)
}

export const isTutorialPath = (pathname: string): boolean => {
  return pathname.startsWith(LEARN_PATHS.TUTORIALS)
}

export const isExercisePath = (pathname: string): boolean => {
  return pathname.startsWith(LEARN_PATHS.EXERCISES)
}

export const isVivyPath = (pathname: string): boolean => {
  return pathname.startsWith(LEARN_PATHS.VIVY)
}

// Extract route segments
export const extractLearnRouteSegments = (pathname: string) => {
  if (!isLearnPath(pathname)) {
    return null
  }

  const segments = pathname.split("/").filter(Boolean)
  const [, section, langSlug, tutSlug, exerciseSlug] = segments

  return {
    section, // 'Tutorials', 'Exercise', 'Vivy', etc.
    langSlug,
    tutSlug,
    exerciseSlug,
    fullPath: pathname,
  }
}
