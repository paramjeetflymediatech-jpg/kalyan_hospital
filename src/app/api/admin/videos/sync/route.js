import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import Video from '@/models/Video';
import { verifyToken } from '@/lib/auth';

const youtube = google.youtube('v3');

export async function POST(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID in environment variables' 
      }, { status: 400 });
    }

    const response = await youtube.search.list({
      key: apiKey,
      channelId: channelId,
      part: 'snippet',
      maxResults: 20,
      order: 'date',
      type: 'video',
      headers: {
        'Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }
    });

    const videos = response.data.items;
    let newCount = 0;

    for (const item of videos) {
      const [video, created] = await Video.findOrCreate({
        where: { youtube_id: item.id.videoId },
        defaults: {
          youtube_id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high.url,
          published_at: item.snippet.publishedAt,
          category: 'Robotic Surgery'
        }
      });
      if (created) newCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Sync complete. Found ${videos.length} videos, added ${newCount} new ones.`,
      count: newCount
    });
  } catch (error) {
    console.error('YouTube Sync Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const videos = await Video.findAll({ order: [['published_at', 'DESC']] });
    return NextResponse.json({ success: true, data: videos });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await verifyToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await Video.destroy({ where: { id } });
    return NextResponse.json({ success: true, message: 'Video record deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
