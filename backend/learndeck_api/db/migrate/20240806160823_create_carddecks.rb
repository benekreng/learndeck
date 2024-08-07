class CreateCarddecks < ActiveRecord::Migration[7.1]
  def change
    create_table :carddecks do |t|
      t.string :title
      t.string :author
      t.string :description
      t.json :contents

      t.timestamps
    end
  end
end
