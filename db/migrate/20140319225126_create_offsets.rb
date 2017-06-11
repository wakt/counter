class CreateOffsets < ActiveRecord::Migration
  def change
    create_table :offsets do |t|

      t.timestamps
    end
  end
end
