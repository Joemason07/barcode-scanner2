
const PROFILE_KEY = 'scanly-profile';

const DEFAULT_PROFILE = {
  displayName: '',
  email: '',
  avatar: '',
  preferences: {
    theme: 'system',
    nutritionUnit: 'per100g'
  }
};

function readProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);

    if (!saved) {
      return structuredClone(DEFAULT_PROFILE);
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      preferences: {
        ...DEFAULT_PROFILE.preferences,
        ...(parsed.preferences || {})
      }
    };
  } catch (error) {
    console.error('Could not load Scanly profile:', error);
    return structuredClone(DEFAULT_PROFILE);
  }
}

export function getProfile() {
  return readProfile();
}

export function updateProfile(changes = {}) {
  const current = readProfile();

  const updated = {
    ...current,
    ...changes,
    preferences: {
      ...current.preferences,
      ...(changes.preferences || {})
    }
  };

  localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));

  return updated;
}

export function resetProfile() {
  localStorage.removeItem(PROFILE_KEY);

  return structuredClone(DEFAULT_PROFILE);
}
