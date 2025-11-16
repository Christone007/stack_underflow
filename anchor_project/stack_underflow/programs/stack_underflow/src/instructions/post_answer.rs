use anchor_lang::prelude::*;

use crate::errors::StackError;
use crate::states::*;

pub fn post_answer(ctx: Context<PostAnswer>, answer_body: String) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct PostAnswer<'info> {
    pub answer_author: Signer<'info>,
    pub answer: Account<'info, Answer>,
}
