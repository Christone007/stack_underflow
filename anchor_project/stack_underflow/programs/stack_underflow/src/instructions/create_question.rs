use anchor_lang::prelude::*;

use crate::errors::StackError;
use crate::states::*;

pub fn create_question(ctx: Context<CreateQuestion>, topic: String, body: String) -> Result<()> {
    let question: &mut Account<'_, Question> = &mut ctx.accounts.question;
    let creator = &ctx.accounts.question_authority;

    require!(
        topic.len() <= QUESTION_TOPIC_LENGTH,
        StackError::QuestionTopicTooLong
    );

    require!(
        body.len() <= QUESTION_BODY_LENGTH,
        StackError::QuestionBodyTooLong
    );

    question.question_creator = creator.key();
    question.question_topic = topic;
    question.question_body = body;
    question.answer_count = 0;

    Ok(())
}

#[derive(Accounts)]
#[instruction(topic: String)]
pub struct CreateQuestion<'info> {
    #[account(mut)]
    pub question_authority: Signer<'info>,
    #[account(
        init,
        payer=question_authority,
        space=8 + Question::INIT_SPACE,
        seeds=[QUESTION_SEED.as_bytes(), topic.as_bytes(), question_authority.key().as_ref()], // question_authority is now part of the seed to allow questions to be unique to their creators
        bump,
    )]
    pub question: Account<'info, Question>,
    pub system_program: Program<'info, System>,
}
