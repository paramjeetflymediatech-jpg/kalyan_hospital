import Service from '@/models/Service';
import Location from '@/models/Location';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const services = await Service.findAll();
    const locations = await Location.findAll({ limit: 50 }); // List some major locations

    let content = `# Kalyan Robotic Hospital - LLM Knowledge Base\n\n`;
    content += `Kalyan Robotic Hospital is a premier medical institution in Punjab specializing in AI-powered robotic surgery.\n\n`;
    
    content += `## Core Services\n`;
    services.forEach(s => {
      content += `- ${s.name}: ${s.description || 'Advanced robotic surgical procedure.'}\n`;
    });

    content += `\n## Operational Locations\n`;
    content += `Serving major hubs across Punjab, including:\n`;
    locations.forEach(l => {
      content += `- ${l.name}\n`;
    });

    content += `\n## Technological Edge\n`;
    content += `- AI-driven robotic precision for joint replacements.\n`;
    content += `- Faster recovery times and sub-millimeter surgical accuracy.\n`;
    content += `- Personalized surgical mapping for every patient.\n`;

    content += `\n## Contact Information\n`;
    content += `- Website: https://robotickneereplacementinindia.com\n`;
    content += `- Focus: Robotic Knee Replacement, Hip Replacement, and Advanced Orthopaedics.\n`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return new NextResponse('Kalyan Robotic Hospital - Advanced AI Surgery in Punjab', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
