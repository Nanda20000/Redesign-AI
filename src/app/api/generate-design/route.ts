import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '../../../../lib/ai';
import componentsData from '../../../../components-library/components.json';

interface Section {
  type: string;
  text: string;
}

interface Component {
  name: string;
  category: string;
  file: string;
  description: string;
}

interface ComponentsLibrary {
  components: Component[];
  categories: string[];
}

const componentsLibrary = componentsData as ComponentsLibrary;

function filterComponentsByCategory(category: string): Component[] {
  return componentsLibrary.components.filter(
    (component) => component.category.toLowerCase() === category.toLowerCase()
  );
}

function createPrompt(sectionType: string, sectionText: string, availableComponents: Component[]): string {
  const componentNames = availableComponents.map((c) => c.name).join('\n');

  return `You are a professional UI designer.

Choose the best component for this website section.

Section type: ${sectionType.toUpperCase()}
Section text: ${sectionText}

Available components:
${componentNames}

Return ONLY the component name.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sections }: { sections: Section[] } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid request. Expected "sections" array.' },
        { status: 400 }
      );
    }

    const layout: { section: string; component: string }[] = [];

    for (const section of sections) {
      const { type, text } = section;
      const availableComponents = filterComponentsByCategory(type);

      if (availableComponents.length === 0) {
        layout.push({ section: type, component: 'none' });
        continue;
      }

      const prompt = createPrompt(type, text, availableComponents);
      const aiResponse = await generateAIResponse(prompt);

      // Extract component name from AI response (trim whitespace)
      const selectedComponent = aiResponse.trim();

      layout.push({ section: type, component: selectedComponent });
    }

    return NextResponse.json({ layout });
  } catch (error) {
    console.error('Error generating design:', error);
    return NextResponse.json(
      { error: 'Failed to generate design' },
      { status: 500 }
    );
  }
}
