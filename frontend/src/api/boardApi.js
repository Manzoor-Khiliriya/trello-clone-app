const API_BASE_URL = "http://localhost:5000/board";


export const fetchBoard = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.board;
  } catch (error) {
    return { lists: [] };
  }
};

export const moveCard = async (movePayload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/card/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movePayload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.board;
  } catch (error) {
    throw error;
  }
};

export const addCard = async ({ listId, title }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listId, title }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.board;
  } catch (error) {
    throw error;
  }
};

export const addList = async (title) => {
  try {
    const response = await fetch(`${API_BASE_URL}/list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.board;
  } catch (error) {
    throw error;
  }
};

export const findCardByTag = async (tag) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/card/search?tag=${encodeURIComponent(tag)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();

    return {
      lists: [
        {
          id: "search-results",
          title: `Search: ${tag}`,
          cards: result.data || [],
        },
      ],
    };
  } catch (error) {
    throw error;
  }
};

