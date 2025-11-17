use anchor_lang::prelude::*;

use crate::errors::StackError;
use crate::states::*;

pub fn post_answer(ctx: Context<PostAnswer>, answer_body: String) -> Result<()> {
    let answer_author = &ctx.accounts.answer_author;
    let answer = &mut ctx.accounts.answer;
    let root_question = &mut ctx.accounts.question;
    let answer_body = answer_body;

    // verify that answer body is not longer than allowed
    require!(
        answer_body.len() <= ANSWER_LENGTH,
        StackError::AnswerTooLong
    );

    // set the values in the answer pda
    answer.answer_author = answer_author.key();
    answer.answer_body = answer_body;
    answer.timestamp = Clock::get()?.unix_timestamp;

    // increment the answer_count on the question
    root_question.answer_count += 1;

    Ok(())
}

#[derive(Accounts)]
pub struct PostAnswer<'info> {
    #[account(mut)]
    pub answer_author: Signer<'info>,
    #[account(
        init,
        payer=answer_author,
        space= 8 + Answer::INIT_SPACE,
        seeds = [ANSWER_SEED.as_bytes(), question.key().as_ref(), &question.answer_count.to_le_bytes()],
        bump,
    )]
    pub answer: Account<'info, Answer>,
    #[account(mut)]
    pub question: Account<'info, Question>,
    pub system_program: Program<'info, System>,
}
