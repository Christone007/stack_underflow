use anchor_lang::prelude::*;

use crate::errors::StackError;
use crate::states::*;

pub fn create_question(ctx: Context<CreateQuestion>, topic: String, body: String) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
#[instruction(topic: String)]
pub struct CreateQuestion<'info> {
    pub question_authority: Signer<'info>,
    pub question: Account<'info, Question>,
    pub system_program: Program<'info, System>,
}
