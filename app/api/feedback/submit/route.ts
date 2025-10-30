import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { title, state } = await request.json();

    if (!title || !state) {
      return NextResponse.json(
        { error: "Missing title or state" },
        { status: 400 }
      );
    }

    // Check if idea with same title already exists
    const existing = await prisma.feedbackItem.findUnique({
      where: { title }
    });

    if (existing) {
      return NextResponse.json(
        { error: "An idea with this title already exists" },
        { status: 409 }
      );
    }

    // Get the highest sortOrder to add the new item at the end
    const lastItem = await prisma.feedbackItem.findFirst({
      orderBy: { sortOrder: "desc" }
    });

    const newFeedback = await prisma.feedbackItem.create({
      data: {
        title,
        state,
        votes: 0,
        sortOrder: (lastItem?.sortOrder ?? -1) + 1
      }
    });

    return NextResponse.json(newFeedback, { status: 201 });
  } catch (error) {
    console.error("Submit idea error:", error);
    return NextResponse.json(
      { error: "Failed to submit idea" },
      { status: 500 }
    );
  }
}
