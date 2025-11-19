use anchor_lang::prelude::*;

pub const QUESTION_TOPIC_LENGTH: usize = 32;
pub const QUESTION_BODY_LENGTH: usize = 200;
pub const ANSWER_LENGTH: usize = 300;

pub const QUESTION_SEED: &str = "QUESTION";
pub const ANSWER_SEED: &str = "ANSWER";

#[account]
#[derive(InitSpace)]
pub struct Question {
    pub question_creator: Pubkey,
    #[max_len(QUESTION_TOPIC_LENGTH)]
    pub question_topic: String,
    #[max_len(QUESTION_BODY_LENGTH)]
    pub question_body: String,
    pub answer_count: u32,
}

#[account]
#[derive(InitSpace)]
pub struct Answer {
    pub answer_author: Pubkey,
    #[max_len(ANSWER_LENGTH)]
    pub answer_body: String,
    pub timestamp: i64,
}
