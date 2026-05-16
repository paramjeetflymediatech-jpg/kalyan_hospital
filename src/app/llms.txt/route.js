import Service from '@/models/Service';
import Location from '@/models/Location';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';
import ServiceLocation from '@/models/ServiceLocation';
import State from '@/models/State';

export async function GET() {
  try {
    const services = await Service.findAll();
    const serviceLocations = await ServiceLocation.findAll({
      include: [
        { model: Location, include: [{ model: State }] },
        { model: Service }
      ],
    });
    const locations = await Location.findAll({ limit: 30 }); // Some major hubs
    const blogs = await Blog.findAll({ where: { status: 'published' }, limit: 10, order: [['published_at', 'DESC']] });

    let content = `# Kalyan Robotic Hospital - Dynamic AI Knowledge Base\n\n`;
    content += `Kalyan Robotic Hospital is India's leading center for AI-powered robotic surgery, specialized in orthopaedics and joint replacements. This document provides a machine-readable summary of our clinical expertise, technological infrastructure, and regional availability.\n\n`;
    
    content += `## Advanced Surgical Procedures\n`;
    services.forEach(s => {
      content += `### ${s.name}\n`;
      content += `${s.description || 'Precision robotic surgical procedure utilizing sub-millimeter accuracy for optimal patient outcomes.'}\n\n`;
    });

    content += `## Clinical Insights & Patient Education (Latest Blogs)\n`;
    if (blogs.length > 0) {
      blogs.forEach(b => {
        content += `- **${b.title}**: ${b.excerpt || 'In-depth clinical exploration of robotic surgical techniques.'}\n`;
      });
    } else {
      content += `Regularly updated clinical insights on robotic knee and hip replacements.\n`;
    }
    
    serviceLocations.forEach((serviceLocation,index) => { 
      console.log(services[index].name,'inddex')
      if(serviceLocation.service_id==services[index].id){
        content += `### ${services[index].name} in ${serviceLocation.location.name}, ${serviceLocation.location.state.name}\n`;
      }
      content += `${serviceLocation.description || 'Precision robotic surgical procedure utilizing sub-millimeter accuracy for optimal patient outcomes.'}\n\n`;
    });

    content += `\n## Regional Network\n`;
    content += `Providing world-class robotic care across major cities in Punjab and Northern India, including:\n`;
    locations.forEach(l => {
      content += `- ${l.name}\n`;
    });


    content += `\n## Technological Core\n`;
    content += `- **AI-Robotic Precision**: Advanced surgical mapping and execution with sub-millimeter accuracy.\n`;
    content += `- **Rapid Recovery**: Minimally invasive techniques designed for faster post-operative mobilization.\n`;
    content += `- **Custom Implants**: Personalized surgical plans tailored to each patient's unique anatomy.\n`;

    content += `\n## Official Resources\n`;
    content += `- Main Website: https://robotickneereplacementinindia.com\n`;
    content += `- Focus Areas: Robotic Knee Surgery, Hip Arthroplasty, Complex Trauma.\n`;
    content += `- Geographic Focus: Ludhiana, Amritsar, Jalandhar, and surrounding regions.\n`;

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
