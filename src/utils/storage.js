export const loadStats = () => {
  try {
    const saved = localStorage.getItem('examen-stats');
    return saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error('Load error:', err);
    return null;
  }
};

export const saveStats = (stats) => {
  try {
    localStorage.setItem('examen-stats', JSON.stringify(stats));
  } catch (err) {
    console.error('Save error:', err);
  }
};