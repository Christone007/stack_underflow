use anchor_lang::prelude::*;

#[error_code]
pub enum StackError {
    #[msg("Cannot initialize, Question topic too long")]
    QuestionTopicTooLong,
    #[msg("Cannot initialize, Question body too long")]
    QuestionBodyTooLong,
    #[msg("Cannot Post, Answer too long")]
    AnswerTooLong,
    #[msg("Invalid answer index provided")]
    InvalidAnswerIndex,
}
