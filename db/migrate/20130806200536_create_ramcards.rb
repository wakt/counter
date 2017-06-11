class CreateRamcards < ActiveRecord::Migration
  def change
    create_table :ramcards do |t|

      t.timestamps
    end
  end
end
