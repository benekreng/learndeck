class Carddeck < ApplicationRecord
  validates :contents, presence: true
  validates :title, presence: true
  validates :author, presence: true, allow_blank: true
  validates :description, presence: true, allow_blank: true
end