// Web Worker for generating random data
self.onmessage = function(e) {
  const { schema, count, batchSize = 1000 } = e.data;

  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
  ];

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = (arr) => arr[random(0, arr.length - 1)];

  const generateFieldValue = (field) => {
    const fieldType = field.type;

    // Handle object types
    if (typeof fieldType === 'object' && fieldType.type) {
      if (fieldType.type === 'object') {
        const obj = {};
        Object.entries(fieldType.properties).forEach(([key, propField]) => {
          obj[key] = generateFieldValue(propField);
        });
        return obj;
      }

      if (fieldType.type === 'array') {
        const length = fieldType.length || random(2, 5);
        return Array.from({ length }, () => generateFieldValue(fieldType.items));
      }
    }

    // Handle primitive types
    const typeStr = typeof fieldType === 'string' ? fieldType : 'string';
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);

    switch (typeStr.toLowerCase()) {
      case 'string':
        return `${firstName} ${lastName}`;
      case 'number':
        return random(1, 1000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'email':
        return `${firstName.toLowerCase()}${lastName.toLowerCase()}${random(1, 999)}@example.com`;
      case 'phone':
        return `+1 (${random(200, 999)}) ${random(100, 999)}-${random(1000, 9999)}`;
      case 'uuid':
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      case 'date':
        const year = random(2020, 2024);
        const month = random(1, 12);
        const day = random(1, 28);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      case 'url':
        return `https://example.com/${firstName.toLowerCase()}`;
      case 'ipaddress':
      case 'ip':
        return `${random(1, 255)}.${random(0, 255)}.${random(0, 255)}.${random(0, 255)}`;
      default:
        return `Sample ${typeStr}`;
    }
  };

  const generateRandomData = () => {
    const data = {};
    schema.forEach(field => {
      data[field.name] = generateFieldValue(field);
    });
    return data;
  };

  try {
    const batch = [];

    // Generate in chunks and report progress
    for (let i = 0; i < count; i += batchSize) {
      const remaining = Math.min(batchSize, count - i);
      const chunk = [];

      for (let j = 0; j < remaining; j++) {
        chunk.push(generateRandomData());
      }

      batch.push(...chunk);

      // Report progress
      const progress = Math.min(100, Math.round(((i + remaining) / count) * 100));
      self.postMessage({
        type: 'progress',
        progress,
        generated: i + remaining
      });
    }

    // Send complete data
    self.postMessage({
      type: 'complete',
      data: batch
    });
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error.message
    });
  }
};
