import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { feedbackId, voteType } = await request.json();

    if (!feedbackId || !voteType) {
      return NextResponse.json(
        { error: "Missing feedbackId or voteType" },
        { status: 400 }
      );
    }

    if (voteType !== "upvote" && voteType !== "downvote") {
      return NextResponse.json(
        { error: "Invalid voteType. Must be 'upvote' or 'downvote'" },
        { status: 400 }
      );
    }

    const increment = voteType === "upvote" ? 1 : -1;

    const updatedFeedback = await prisma.feedbackItem.update({
      where: { id: feedbackId },
      data: {
        votes: {
          increment
        }
      }
    });

    return NextResponse.json(updatedFeedback);
  } catch (error) {
    console.error("Vote error:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
