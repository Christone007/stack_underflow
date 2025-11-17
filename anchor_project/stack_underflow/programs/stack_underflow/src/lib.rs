#![allow(unexpected_cfgs)]

use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("GSKUuDySaKJbVUiHqBa2yLpbVXLL2yZCvcp3oks9jLCL");

#[program]
pub mod stack_underflow {
    use super::*;

    pub fn initialize(
        ctx: Context<CreateQuestion>,
        question_topic: String,
        question_body: String,
    ) -> Result<()> {
        create_question(ctx, question_topic, question_body)
    }

    pub fn answer(ctx: Context<PostAnswer>, answer_body: String) -> Result<()> {
        post_answer(ctx, answer_body)
    }
}
